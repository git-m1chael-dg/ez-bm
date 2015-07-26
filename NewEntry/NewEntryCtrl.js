hpiModule.controller('NewEntryCtrl', function ($scope, $http, $timeout,toaster,CommonFunc) {

        var self = this;
        self.PostUrl = "http://hpidirectsales.ph/easyencoding.php";
        self.userCodeCheckerUrl = "http://hpidirectsales.ph/checker.php";
        self.currentRequestIndex = 0;

        $scope.parseMessage = '';
        $scope.logs = [];

        $scope.version = CommonFunc.version();
        $scope.stopEncoding = true;
        $scope.isDone = true;
        $scope.enableEncodeOneItem = false;

        $scope.selectAll = false;
        $scope.isInputFieldsAreValid =  inputFieldsAreValid();

        $scope.uplineUserCode = '';
        $scope.firstName = '';
        /*$scope.middleName = '';*/
        $scope.lastName = '';
        $scope.password = '';
        $scope.teamDisplay = '';
        $scope.teamValue = '';

        getTeam();

        $scope.csvContent = '';
        $scope.accounts = [];

        $scope.Parse = function () {
            var allTextLines = $scope.csvContent.split(/\r\n|\n/);
            $scope.accounts = [];
            var index = 1;
            var delimiter = CommonFunc.determineDelimiter(allTextLines);
            for (var i = 0; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(delimiter);
                if (data.length >= 3 && data[0] && data[1] && data[2]) {
                    $scope.accounts.push(new Account(index, data[0], data[1], data[2], '', false));
                    index++;
                }
                else {
                    var lineNo = i + 1;
                    CommonFunc.PopWarning("Invalid data was found  at line " + lineNo);
                    log("Invalid data was found  at line " + lineNo);
                }
            }

            CommonFunc.validateActivationCodes($scope.accounts);

            $scope.parseMessage = "Parsed " + $scope.accounts.length + " record(s) and it has " + CommonFunc.countInvalidCodes($scope.accounts) + " error(s) or invalid code(s)";
        };

        $scope.StopEncoding = function () {
            $scope.stopEncoding = true;
            CommonFunc.PopWarning("Stopping the current encoding..pls wait");
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

        $scope.EncodeOneItem = function (account) {
            if (validateInput() && CommonFunc.isValidateUserCode(account)) {

                $scope.isDone = false;
                $scope.stopEncoding = false;

                makeUpperCase();
                account.MakeUpperCase();

                var postData = getPostData(account);

                account.EncodeBtn = "Encoding";

                $http.post(self.PostUrl, postData, CommonFunc.getFormEncodingHeader()).success(function (data, status) {
                    $scope.isDone = true;
                    account.EncodeBtn = "Encode";
                    if (status == 0) {
                        log('No connection. Verify application is hpi is reachable.');
                    } else if (status == 401) {
                        log('Unauthorized');
                    } else if (status == 405) {
                        log('HTTP verb not supported [405]');
                    } else if (status == 500) {
                        log('Internal Server Error [500].');
                    } else {
                        var success = isSuccess(account, data);
                        if (success) {
                            log("Successfully encoded. User code : " + account.UserCode);
                            CommonFunc.PopSuccess("Success. User code : " + account.UserCode);
                        }else{
                            CommonFunc.PopError("Failed encoding of User code : " + account.UserCode);
                        }
                    }
                }).error(function (data, status) {
                    if (status == 0) {
                        log('No connection. Verify application is hpi is reachable.');
                    } else if (status == 401) {
                        log('Unauthorized');
                    } else if (status == 405) {
                        log('HTTP verb not supported [405]');
                    } else if (status == 500) {
                        log('Internal Server Error [500].');
                    } else {
                        log(data);
                    }
                    log("Failure. User code : " + account.UserCode);
                    $scope.isDone = true;
                    account.EncodeBtn = "Encode";
                    CommonFunc.PopError("Failure. User code : " + account.UserCode);
                });

            }
        };

        $scope.ActivationCodeChange = function (account) {
            CommonFunc.validateActivationCode(account);
        };

        $scope.selectAllFn = function (selectAll) {
            angular.forEach($scope.accounts, function (account) {
                account.WasEncoded = selectAll;
            });
        };
        $scope.isSelectedAll = function () {
            return CommonFunc.isSelectedAll($scope.accounts);
        };

        $scope.getArrayForCsv = function () {
            return CommonFunc.getArrayForCsv($scope.accounts);
        };

        function inputFieldsAreValid (){
            var isValid = true;


            if(!isValidControlCheckByName("mainsponsor","Main Sponsor User Code")){
                log("mainupline changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("teams",null)){
                log("mainupline changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("firstname","Firstname Here")){
                log("firstname changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("lastname","Lastname Here")){
                log("lastname changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("password","Password Here")){
                log("password changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("usercode","Usercode Here")){
                log("usercode changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("referral","Referral Here	")){
                log("referral changed");
                isValid = false;
            }
            else if(!isValidControlCheckByName("activationpin","Activation Pin Here")){
                log("pin changed");
                isValid = false;
            }
            return isValid;
        }

        function getTeam(){

            var option = $('[name=teams] option').filter(function() {
                return ($(this).text() == 'SAUDI GRIFFIN'); //To select SAUDI GRIFFIN
            });

            $scope.teamValue = option.prop('value');
            $scope.teamDisplay = option.prop('value') + '-' + option.text();

        }

        function getPostData(account) {
            return {
                mainsponsor: $scope.uplineUserCode,
                teams:$scope.teamValue,
                usercode: account.UserCode,
                password: $scope.password,
                referral: account.ReferredBy,
                firstname: $scope.firstName,
                lastname: $scope.lastName,
                activationpin: account.ActivationCode,
                submit: 'Submit'
            };

        }

        function validateInput() {
            var result = $scope.firstName && $scope.lastName &&
                    $scope.password && $scope.uplineUserCode && $scope.teamValue; //&& $scope.middleName
            if(!result){
                var msg ="Upline user code, username, password, last name, first name and team are required fields";
                log(msg);
                CommonFunc.PopError(msg);
            }


            return result;
        }

        function next() {
            if(!$scope.stopEncoding)
                $timeout(makeNextRequest, 500);
            else
                $scope.isDone = true;
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
                    account.EncodeBtn = "Encode";
                    self.currentRequestIndex++;
                    next();
                    return;
                }

                if (CommonFunc.isValidateUserCode(account)) {
                    var postData = getPostData(account);
                    account.EncodeBtn = "Encoding";
                    doPost(account, postData);
                    return;
                }
            }
            $scope.isDone = true;
            $scope.stopEncoding = false;
        }

        function doPost(account, postData) {


            $http.post(self.PostUrl, postData, CommonFunc.getFormEncodingHeader())
            .success(function (data, status) {

                account.EncodeBtn = "Encode";
                if (status == 0) {
                    log('No connection. Verify application is hpi is reachable.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                } else {
                    var success = isSuccess(account, data);
                    if (success) {
                        log("Successfully encoded. User code : " + account.UserCode);
                        self.currentRequestIndex++;
                    }else{
                        CommonFunc.PopError("Failed encoding of User code : " + account.UserCode);
                    }
                    if (success && self.currentRequestIndex < $scope.accounts.length) {
                        next();
                    } else
                        $scope.isDone = true;
                }

            }).error(function (data, status) {
                account.EncodeBtn = "Encode";
                if (status == 0) {
                    log('No connection. Verify application is hpi is reachable.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                } else {
                    log(data);
                }
                log("Failure. User code : " + account.UserCode);
                $scope.isDone = true;
                CommonFunc.PopError("Failure. User code : " + account.UserCode);
            });
        }

        function isSuccess(account, response) {
            var m;
            account.IsError = true;
            account.IsSuccess = false;
            if ((m = /([a-zA-Z0-9, -]*please try again]*)/i.exec(response)) !== null) {
                var message = m[1];

                account.WasEncoded = 'Account already exist, please try again' == message;
                account.Status = message;
            }else if ((m = /([a-zA-Z0-9, -]*successfully[a-zA-Z ]*)/i.exec(response)) !== null) {
                var message = m[1];
                account.Status = message;
                account.WasEncoded = true;
                account.IsError = false;
                account.IsSuccess = true;
            }else if (response.indexOf("max_user_connections") > -1) {
                account.Status = "User hpidirec_admin already has more than 'max_user_connections' active connections";
                account.WasEncoded = false;
                log("User hpidirec_admin already has more than 'max_user_connections' active connections");
            }else if(/Please login first/i.exec(response)){
                account.Status = "Your session has been expired. Please re-login again and comeback to this page. Meaning nalogout ka sa na sa system";
                log("Please login first");
                CommonFunc.PopError("Please login first");
            }else{
                account.Status = "cannot determine the response of the server.";
                log("User code '" + account.UserCode + "' was send to server but the server did not respond properly or the status is different");
                log(response);
            }

            return account.WasEncoded;
        }

        function makeUpperCase() {
            $scope.uplineUserCode = $scope.uplineUserCode.toUpperCase().trim();
            $scope.firstName = $scope.firstName.toUpperCase().trim();
            //$scope.middleName = $scope.middleName.toUpperCase().trim();
            $scope.lastName = $scope.lastName.toUpperCase().trim();
        }

        function log(msg) {
            $scope.logs.push(CommonFunc.getCurrentTime() + " : " + msg);
            console.log(msg);
        }

        function isValidControlCheckByName(name,placeholder){
            var valid = false;
            var elements = document.getElementsByName(name);

            if(elements && elements.length > 0) {
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