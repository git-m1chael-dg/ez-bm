function Account(index, userCode, referredBy, activationCode, status, wasEncoded) {
    var self = this;
    self.Index = index;
    self.UserCode = userCode;
    self.ReferredBy = referredBy;
    self.ActivationCode = activationCode;
    self.Status = status;
    self.WasEncoded = wasEncoded;

    self.MakeUpperCase = function () {
        self.UserCode = self.UserCode.toUpperCase();
        self.ReferredBy = self.ReferredBy.toUpperCase();
        self.ActivationCode = self.ActivationCode.toUpperCase();
    }
}

angular.module('hpi-encoder', [])
    .controller('hpiEncoderController', function ($scope, $http, $timeout,toaster) {

        var self = this;
        self.newentryPostUrl = "http://hpidirectsales.ph/signup-newentry.php?page_id=88";
        self.reentryPostUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/easyencoding-reentry.php";
        self.userCodeCheckerUrl = "http://hpidirectsales.ph/checker.php";
        self.currentRequestIndex = 0;

        $scope.stopEncoding = true;
        $scope.isDone = true;
        $scope.enableEncodeOneItem = false;

        $scope.isNewEntry = /signup-newentry.php/i.test(location.href);
        $scope.entry = /signup-newentry.php/i.test(location.href) ? "new entry" : "re entry";
        $scope.entries = ["new entry","re entry"];
        $scope.selectAll = false;
        $scope.isInputFieldsAreValid =  inputFieldsAreValid();

        $scope.uplineUserCode = '';
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
                if (data.length >= 3 && data[0] && data[1] && data[2])
                    $scope.accounts.push(new Account(index, data[0], data[1], data[2], '', false));
                else{
                    popwarning("Invalid data was found  at line " + index);
                    log("Invalid data was found  at line " + index);
                }
                index++;
            }

            validateActivationCodes();
        };
        $scope.StopEncoding = function () {
            $scope.stopEncoding = true;
            popwarning("Stopping the current encoding..pls wait");
        };

        $scope.Encode = function () {
            makeUpperCase();

            if (validateInput()) {
                $scope.stopEncoding = false;
                $scope.isDone = false;
                self.currentRequestIndex = 0;
                next();
            }
        };

        $scope.EncodeOneItem = function (index) {
            index--;
            if (validateInput() && index < $scope.accounts.length) {

                $scope.isDone = false;
                $scope.stopEncoding = false;

                var account = $scope.accounts[index];
                makeUpperCase();
                account.MakeUpperCase();

                var postData = getPostData(account);


                var url = IsNewEntry() ? self.newentryPostUrl : self.reentryPostUrl;

                var fd = new FormData();
                var key;
                for (key in postData) {
                    fd.append(key, postData[key]);
                }

                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (data) {
                        $scope.isDone = true;
                        if (isSuccess(account, data)){
                            log("Success. User code : " + account.UserCode);
                            popsuccess("Success. User code : " + account.UserCode);
                        }
                    }).
                    error(function () {
                        log("Failure. User code : " + account.UserCode);
                        poperror("Failure. User code : " + account.UserCode);
                        $scope.isDone = true;
                    });

            }
        };

        $scope.ActivationCodeChange = function (index) {
            index--;
            if (index < $scope.accounts.length) {

                var account = $scope.accounts[index];

                validateActivationCode(account);
            }
        };

        $scope.selectAllFn = function (selectAll) {
            angular.forEach($scope.accounts, function (account) {
                account.WasEncoded = selectAll;
            });
        };
        $scope.isSelectedAll = function () {
            for (var i = 0; i < $scope.accounts.length; i++) {
                if (!$scope.accounts[i].Selected)
                    return false;
            }
            return true;
        };

        $scope.getArrayForCsv = function () {
            var list = [];

            angular.forEach($scope.accounts, function (account) {
                list.push({
                    UserCode: account.UserCode,
                    ReferredBy: account.ReferredBy,
                    ActivationCode: account.ActivationCode
                });
            });

            return list;
        };

        function inputFieldsAreValid () {
            return IsNewEntry() ? inputFieldsAreValidForNewEntry() :  inputFieldsAreValidForReEntry();
        }
        function inputFieldsAreValidForNewEntry (){
            var isValid = true;

            if(IsNewEntry() && getPlaceHolder("main_upline") != "Your Upline User Code")
                isValid = false;
            else  if(getPlaceHolder("iacno") != "User Code Here")
                isValid = false;
            else if(getPlaceHolder("pass") != "Password Here")
                isValid = false;
            else if(getPlaceHolder("vpass") != "Confirm Password")
                isValid = false;
            else if(getPlaceHolder("lname") != "Last Name Here")
                isValid = false;
            else if(getPlaceHolder("frname") != "First Name Here")
                isValid = false;
            else if(getPlaceHolder("mname") != "Middle Name Here")
                isValid = false;
            else if(!IsNewEntry() && getPlaceHolder("sponsor") != "Sponsor ID Here")
                isValid = false;
            else if(IsNewEntry() && getPlaceHolder("sponsor") != "Referred ID Here")
                isValid = false;
            else if(getPlaceHolder("actpin") != "Activation Code Here")
                isValid = false;

            return isValid;
        }
        function inputFieldsAreValidForReEntry (){
            var isValid = true;

            if(!isValidControl("box1","usercode[]","User Code Here"))
                isValid = false;
            else if(!isValidControl("box2","referral[]","Referral Here"))
                isValid = false;
            else if(!isValidControl("box3","pin[]","PIN Here"))
                isValid = false;

            return isValid;
        }

        function IsNewEntry(){
            return $scope.entry == "new entry";
        }

        function getPostData(account) {
            if(IsNewEntry())
                return {
                    main_upline: $scope.uplineUserCode,
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
            else
                return {
                    "usercode[]": account.UserCode,
                    "referral[]": $scope.ReferredBy,
                    "pin[]": $scope.ActivationCode,
                    submit: 'Submit'
                };
        }

        function validateInput() {
            var result = true;

            if(IsNewEntry()) {
                result = $scope.firstName && $scope.middleName && $scope.lastName &&
                        $scope.password && $scope.uplineUserCode;
                if(!result){
                    var msg ="Upline user code, username, last name, first name and middle name are required fields";
                    log(msg);
                    poperror(msg);
                }
            }

            /*else
             {
             result = $scope.password < 6;

             if (!result)
             log("Your password must contain 6 characters");
             }*/

            return result;
        }

        function next() {
            if(!$scope.stopEncoding)
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
                        $scope.isDone = true;
                    }
                    else {
                        log('Problem with sql query');
                        account.Status = "Problem with sql query";
                        $scope.isDone = true;
                    }

                }).
                error(function () {
                    log("Failure. Checking user code availability : " + userCode);
                    $scope.isDone = true;
                });
        }

        function makeNextRequest() {
            if (self.currentRequestIndex < $scope.accounts.length) {
                var account = $scope.accounts[self.currentRequestIndex];
                if (account.WasEncoded) {
                    self.currentRequestIndex++;
                    next();
                    return;
                }

                var postData = getPostData(account);

                doPost(account, postData);
            }
        }

        function doPost(account, postData) {
            var url = IsNewEntry() ? self.newentryPostUrl : self.reentryPostUrl;

            var fd = new FormData();
            var key;
            for (key in postData) {
                fd.append(key, postData[key]);
            }

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                    log("Success. User code : " + account.UserCode);
                    self.currentRequestIndex++;
                    if (isSuccess(account, data) && self.currentRequestIndex < $scope.accounts.length) {
                        next();
                    } else
                        $scope.isDone = true;
                }).
                error(function () {
                    log("Failure. User code : " + account.UserCode);
                    $scope.isDone = true;
                });
        }

        function validateActivationCode(account) {

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
                if (!validateActivationCode(account))
                    isValid = false;
            });

            return isValid;
        }

        function setCharAt(str, index, chr) {
            if (index > str.length - 1) return str;
            return str.substr(0, index) + chr + str.substr(index + 1);
        }

        var pattern = /<span class="style20">([A-Za-z\. ]+)<\/span>/;

        function isSuccess(account, response) {
            var m;
            if ((m = pattern.exec(response)) !== null) {
                var message = m[1];

                account.WasEncoded = /successful/i.test(message);
                account.Status = message;
            }

            return account.WasEncoded;
        }

        function makeUpperCase() {
            $scope.uplineUserCode = $scope.uplineUserCode.toUpperCase().trim();
            $scope.firstName = $scope.firstName.toUpperCase().trim();
            $scope.middleName = $scope.middleName.toUpperCase().trim();
            $scope.lastName = $scope.lastName.toUpperCase().trim();
        }

        function log(msg) {
            $scope.logs.push(msg);
            console.log(msg);
        }

        function popwarning(msg) {
            toaster.pop({
                type: 'warning',
                title: 'tatae ako',
                body: msg,
                showCloseButton: true
            });
        }
        function poperror(msg) {
            toaster.pop({
                type: 'error',
                title: 'teka may error',
                body: msg,
                showCloseButton: true
            });
        }
        function popsuccess(msg) {
            toaster.pop({
                type: 'success',
                title: 'ooppss',
                body: msg,
                showCloseButton: true
            });
        }


        function getPlaceHolder(id){
            var element = document.getElementById(id);
            if(element)
                return element.getAttribute("placeholder");
            return null;
        }
        function isValidControl(id,name,placeholder){
            var valid = false;
            var element = document.getElementById(id);

            if(element) {
                valid = true;
                if( valid  && element.getAttribute("name") != name)
                    valid = false;
                if( valid  && element.getAttribute("placeholder") != placeholder)
                    valid = false;
            }
            return valid;
        }
    })
    .directive('hpiEncoder', function () {
        return {
            restrict: 'E',
            template: template
        };
    });