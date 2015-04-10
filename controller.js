function Account(index, userCode, referredBy, activationCode, status, wasEncoded) {
    var self = this;
    self.Index = index;
    self.UserCode = userCode;
    self.ReferredBy = referredBy;
    self.ActivationCode = activationCode;
    self.Status = status;
    self.wasEncoded = wasEncoded;

    self.MakeUpperCase = function () {
        self.UserCode = self.UserCode.toUpperCase();
        self.ReferredBy = self.ReferredBy.toUpperCase();
        self.ActivationCode = self.ActivationCode.toUpperCase();
    }
}


angular.module('hpi-encoder', [])
    .controller('hpiEncoderController', function ($scope, $http, $timeout) {

        var self = this;
        self.postUrl = "http://hpidirectsales.ph/signup-reentry.php?page_id=88";
        self.userCodeCheckerUrl = "http://hpidirectsales.ph/checker.php";
        self.currentRequestIndex = 0;
        self.isDone = true;

        $scope.firstName = '';
        $scope.middleName = '';
        $scope.lastName = '';
        $scope.password = '';

        $scope.csvContent = '';
        $scope.accounts = [];

        $scope.logs = [];
        $scope.Parse = function () {
            var allTextLines = $scope.csvContent.split(/\r\n|\n/);
            $scope.accounts = [];
            var index = 1;
            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                if (data.length == 3 && data[0] && data[1] && data[2])
                    $scope.accounts.push(new Account(index, data[0], data[1], data[2], '', false));
                else
                    log("Invalid data was found  at line " + index);
                index++;
            }

            validateActivationCodes();
        };
        $scope.Encode = function () {

            MakeUpperCase();

            if (validateInput()) {
                self.isDone = false;

                self.currentRequestIndex = 0;

                next();
            }
        };

        $scope.EncodeOneItem = function (index) {
            index--;
            if (validateInput() && index < $scope.accounts.length) {

                var account = $scope.accounts[index];
                MakeUpperCase();
                account.MakeUpperCase();

                var postdata = getPostData(account);

                checkUserName(account, function () {
                    $http.post(self.postUrl, postdata).
                        success(function (data) {
                            self.isDone = true;
                            if (IsSuccess(account, data))
                                log("Success. User code : " + account.UserCode);
                        }).
                        error(function () {
                            log("Failure. User code : " + account.UserCode);
                            self.isDone = true;
                        });
                });


            }

        };

        function getPostData(account) {
            return {
                iacno: account.UserCode,
                pass: $scope.password,
                vpass: $scope.password,
                lname: $scope.lastName,
                frname: $scope.firstName,
                mname: $scope.middleName,
                sponsor: account.ReferredBy,
                actpin: account.ActivationCode,
                txtpostkey: 'Y',
                cmdSend: 'SAVE'
            };
        }

        function validateInput() {
            var result = $scope.firstName && $scope.middleName && $scope.lastName &&
                $scope.password;
            if (!result)
                log("Username, last name, first name and middle name are required fields");
            /*else
             {
             result = $scope.password < 6;

             if (!result)
             log("Your password must contain 6 characters");
             }*/

            return result;
        }

        function next() {
            $timeout(makeNextRequest, 500);
        }

        function checkUserName(account, fn) {
            $http.post(self.userCodeCheckerUrl,
                {action: 'username_availability', iacno: account.UserCode}).
                success(function (data) {
                    if (data == 0) {
                        log("Username name available: " + account.UserCode);

                        fn();
                    }
                    else if (data > 0) {
                        log("Username already taken: " + account.UserCode);
                        account.Status = "Username already taken";
                        self.isDone = true;
                    }
                    else {
                        log('Problem with sql query');
                        account.Status = "Problem with sql query";
                        self.isDone = true;
                    }

                }).
                error(function () {
                    log("Failure. Checking user code availability : " + userCode);
                    self.isDone = true;
                });
        }

        function makeNextRequest() {
            if (self.currentRequestIndex < $scope.accounts.length) {
                var account = $scope.accounts[self.currentRequestIndex];
                if (account.wasEncoded) {
                    self.currentRequestIndex++;
                    next();
                    return;
                }

                var postdata = getPostData(account);

                checkUserName(account, function () {
                    doPost(account, postdata);
                });
            }
        }

        function doPost(account, postdata) {
            $http.post(self.postUrl, postdata).

                success(function (data) {
                    log("Success. User code : " + account.UserCode);
                    self.currentRequestIndex++;
                    if (IsSuccess(account, data) && self.currentRequestIndex < $scope.accounts.length) {
                        next();
                    } else
                        self.isDone = true;
                }).
                error(function () {
                    log("Failure. User code : " + account.UserCode);
                    self.isDone = true;
                });
        }

        $scope.ActivationCodeChange = function (index) {
            index--;
            if (index < $scope.accounts.length) {

                var account = $scope.accounts[index];

                ValidateActivationCode(account);
            }
        };

        function ValidateActivationCode(account) {

            account.ActivationCode = account.ActivationCode.trim();
            //valid code
            if (/[A-Z]{3}\d{6}[A-Z]{3}/i.test(account.ActivationCode)) {
                if (account.Status == "Invalid activation code")
                    account.Status = "";
                //test for zero at 3rd and last
            } else if (/[A-Z]{2}0\d{6}[A-Z]{2}0/i.test(account.ActivationCode)) {
                //try to correct it
                account.ActivationCode = setCharAt(account.ActivationCode, 2, 'O');

                account.ActivationCode = setCharAt(account.ActivationCode, 11, 'O');
            }
            else {
                account.Status = "Invalid activation code";
                return false;
            }
            return true;
        }

        function validateActivationCodes() {
            var isValid = true;

            angular.forEach($scope.accounts, function (account) {
                if (!ValidateActivationCode(account))
                    isValid = false;
            });

            return isValid;
        }

        function setCharAt(str, index, chr) {
            if (index > str.length - 1) return str;
            return str.substr(0, index) + chr + str.substr(index + 1);
        }

        var pattern = /<span class="style20">([A-Za-z\. ]+)<\/span>/;

        function IsSuccess(account, response) {
            var m;
            if ((m = pattern.exec(response)) !== null) {
                var message = m[1];

                account.wasEncoded = /successful/i.test(message);
                account.Status = message;
            }

            return account.wasEncoded;
        }

        function MakeUpperCase() {
            $scope.firstName = $scope.firstName.toUpperCase().trim();
            $scope.middleName = $scope.firstName.toUpperCase().trim();
            $scope.lastName = $scope.firstName.toUpperCase().trim();
        }


        function log(msg) {
            $scope.logs.push(msg);
            console.log(msg);
        }

    })
    .directive('hpiEncoder', function () {
        return {
            restrict: 'E',
            template: template
        };
    });

var template = "";
template += "<div align=\"center\" style=\"background-color: white\">";
template += "    <div class=\"container\">";
template += "        <div class=\"row clearfix\">";
template += "            <div class=\"col-md-12 column\">";
template += "                <div class=\"panel panel-default\">";
template += "                    <div class=\"panel-heading\">";
template += "                        <h3 class=\"panel-title\">";
template += "                            Step 1 : Input the CSV to parse";
template += "                        <\/h3>";
template += "                    <\/div>";
template += "                    <div class=\"panel-body\">";
template += "                        <form role=\"form\">";
template += "                            <div class=\"form-group\">";
template += "                                <label for=\"csvText\">Paste CSV content here<\/label>";
template += "                                <textarea class=\"form-control\" id=\"csvText\" ng-model=\"csvContent\"><\/textarea>";
template += "                            <\/div>";
template += "                            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"Parse()\">Parse<\/button>";
template += "                        <\/form>";
template += "                    <\/div>";
template += "                <\/div>";
template += "            <\/div>";
template += "        <\/div>";
template += "        <div class=\"row clearfix\">";
template += "            <div class=\"col-md-12 column\">";
template += "                <div class=\"panel panel-default\">";
template += "                    <div class=\"panel-heading\">";
template += "                        <h3 class=\"panel-title\">";
template += "                            Step 2 : Input user information";
template += "                        <\/h3>";
template += "                    <\/div>";
template += "                    <div class=\"panel-body\">";
template += "                        <form role=\"form\">";
template += "                            <div class=\"form-group\">";
template += "                                <label for=\"firstName\">First Name<\/label>";
template += "                                <input type=\"text\" id=\"firstName\" class=\"form-control\" placeholder=\"First Name\" ng-model=\"firstName\"\/>";
template += "                            <\/div>";
template += "                            <div class=\"form-group\">";
template += "                                <label for=\"middleName\">Middle Name<\/label>";
template += "                                <input type=\"text\" id=\"middleName\" class=\"form-control\" placeholder=\"Middle Name\" ng-model=\"middleName\"\/>";
template += "                            <\/div>";
template += "                            <div class=\"form-group\">";
template += "                                <label for=\"lastName\">Last Name<\/label>";
template += "                                <input type=\"text\" id=\"lastName\" class=\"form-control\" placeholder=\"Last Name\" ng-model=\"lastName\"\/>";
template += "                            <\/div>";
template += "                            <div class=\"form-group\">";
template += "                                <label for=\"userPassword\">User Password<\/label>";
template += "                                <input type=\"text\" id=\"userPassword\" class=\"form-control\" placeholder=\"User Password\" ng-model=\"password\"\/>";
template += "                            <\/div>";
template += "                            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"Encode()\" ng-disabled=\"done\">Encode All<\/button>";
template += "                        <\/form>";
template += "                        <table class=\"table\">";
template += "                            <thead>";
template += "                            <tr>";
template += "                                <th>";
template += "                                    #";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    User Code";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    Referred By";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    Activation Code";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    Status";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    Was Encoded";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    Action";
template += "                                <\/th>";
template += "                            <\/tr>";
template += "                            <\/thead>";
template += "                            <tbody>";
template += "                            <tr ng-repeat=\"account in accounts\">";
template += "                                <th>";
template += "                                    {{account.Index}}";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    <input type=\"input\" ng-model=\"account.UserCode\"\/>";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    <input type=\"input\" ng-model=\"account.ReferredBy\"\/>";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    <input type=\"input\" ng-model=\"account.ActivationCode\" ng-change=\"ActivationCodeChange({{account.Index}})\"\/>";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    {{account.Status}}";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    <input type=\"checkbox\" ng-model=\"account.WasEncoded\"\/>";
template += "                                <\/th>";
template += "                                <th>";
template += "                                    <button ng-click=\"EncodeOneItem({{account.Index}})\" ng-disabled=\"done\">Encode<\/button>";
template += "                                <\/th>";
template += "                            <\/tr>";
template += "                            <\/tbody>";
template += "                        <\/table>";
template += "                    <\/div>";
template += "                <\/div>";
template += "            <\/div>";
template += "        <\/div>";
template += "        <div class=\"row clearfix\">";
template += "            <div class=\"col-md-12 column\">";
template += "                <div class=\"panel panel-default\">";
template += "                    <div class=\"panel-heading\">";
template += "                        <h3 class=\"panel-title\">";
template += "                            Logs";
template += "                        <\/h3>";
template += "                    <\/div>";
template += "                    <div class=\"panel-body\">";
template += "                        <li ng-repeat=\"log in logs track by $index\">";
template += "                            <span>{{log}}<\/span>";
template += "                        <\/li>";
template += "                    <\/div>";
template += "                <\/div>";
template += "            <\/div>";
template += "        <\/div>";
template += "    <\/div>";
template += "<\/div>";





