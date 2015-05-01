hpiModule.controller('AdvanceCodeCtrl', function ($scope, $http, $timeout,toaster) {

        var self = this;
        self.PostUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/oneclick.php";
        self.userCodeCheckerUrl = "http://hpidirectsales.ph/checker.php";
        self.currentRequestIndex = 0;

        $scope.version = CommonFunc.version();
        $scope.stopEncoding = true;
        $scope.isDone = true;
        $scope.enableEncodeOneItem = false;

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
                account.MakeUpperCase();

                var postData = getPostData(account);


                var fd = new FormData();
                var key;
                for (key in postData) {
                    fd.append(key, postData[key]);
                }

                $http.post(self.PostUrl, fd, {
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
            var isValid = true;

            if(!isValidControl("box1","usercode[]","User Code Here"))
                isValid = false;
            else if(!isValidControl("box2","referral[]","Referral Here"))
                isValid = false;
            else if(!isValidControl("box3","pin[]","PIN Here"))
                isValid = false;

            return isValid;
        }

        function getPostData(account) {
            return {
                "usercode[]": account.UserCode,
                "referral[]": $scope.ReferredBy,
                "pin[]": $scope.ActivationCode,
                submit: 'Submit'
            };
        }

        function validateInput() {
            var result = true;

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

            var fd = new FormData();
            var key;
            for (key in postData) {
                fd.append(key, postData[key]);
            }

            $http.post(self.PostUrl, fd, {
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
            if (/[A-Z0-9]{11}0/i.test(account.ActivationCode))
            {
                //try to correct it
                account.ActivationCode = setCharAt(account.ActivationCode, 11, "O");
            }
            if (/[A-Z]{2}0[A-Z0-9]{9}/i.test(account.ActivationCode))
            {
                //try to correct it
                account.ActivationCode = setCharAt(account.ActivationCode, 2, "O");
            }
            if (/[A-Z]{2}0\d{6}[A-Z]{2}0/i.test(account.ActivationCode)) {
                //try to correct it
                account.ActivationCode = setCharAt(account.ActivationCode, 2, 'O');

                account.ActivationCode = setCharAt(account.ActivationCode, 11, 'O');
            }
            //valid code
            if (/[A-Z]{3}\d{6}[A-Z]{3}/i.test(account.ActivationCode)) {
                if (account.Status == "Invalid activation code")
                    account.Status = "";
                return true;
            }

            account.Status = "Invalid activation code";
            return false;
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
        function isValidControlCheckByName(name,placeholder){
            var valid = false;
            var elements = document.getElementsByName(name);

            if(elements) {
                valid = true;
                var element = elements[0];
                if( valid  && element.getAttribute("name") != name)
                    valid = false;
                if( valid  && element.getAttribute("placeholder") != placeholder)
                    valid = false;
            }
            return valid;
        }
    });