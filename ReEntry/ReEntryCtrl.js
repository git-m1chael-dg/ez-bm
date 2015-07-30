hpiModule.controller('ReEntryCtrl', function ($scope, $http, $timeout, toaster, CommonFunc) {

    var self = this;
    self.PostUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/easyencoding-reentry.php";
    self.userCodeCheckerUrl = "http://hpidirectsales.ph/checker.php";
    self.currentRequestIndex = 0;

    $scope.parseMessage = '';
    $scope.logs = [];

    $scope.version = CommonFunc.version();
    $scope.stopEncoding = true;
    $scope.isDone = true;
    $scope.enableEncodeOneItem = false;

    $scope.selectAll = false;
    $scope.isInputFieldsAreValid = inputFieldsAreValid();

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
        $scope.stopEncoding = false;
        $scope.isDone = false;
        self.currentRequestIndex = 0;
        next();
    };

    $scope.EncodeOneItem = function (account) {

        if (CommonFunc.isValidateUserCode(account) == false)
            return;

        account.EncodeBtn = "Encoding";
        $scope.isDone = false;
        $scope.stopEncoding = false;

        account.MakeUpperCase();

        var postData = getPostData(account);


        $http.post(self.PostUrl, postData, CommonFunc.getFormEncodingHeader())
            .success(function (data, status) {
                $scope.isDone = true;
                if (status == 0) {
                    log('No connection. Verify application is running.');
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
                    } else {
                        CommonFunc.PopError("Failed encoding of User code : " + account.UserCode);
                        account.WasEncoded = 'Account already exist, please try again' == account.Status.trim();
                    }
                }
                account.EncodeBtn = "Encode";
            }).error(function (data, status) {
                if (status == 0) {
                    log('No connection. Verify application is running.');
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
                account.EncodeBtn = "Encode";
            });

    };

    $scope.EncodeBy10 = function () {
        var count = 0;

        angular.forEach($scope.accounts, function (account) {
            if (account.WasEncoded == false && count < 10) {
                $scope.EncodeOneItem(account);
                count++;
            }
        });
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

    function inputFieldsAreValid() {
        var isValid = true;

        if (!CommonFunc.isValidControlCheckByName("usercode", "Usercode Here")) {
            log("usercode changed");
            isValid = false;
        }
        else if (!CommonFunc.isValidControlCheckByName("referral", "Referral Here	")) {
            log("referral changed");
            isValid = false;
        }
        else if (!CommonFunc.isValidControlCheckByName("activationpin", "Activation Pin Here")) {
            log("pin changed");
            isValid = false;
        }

        return isValid;
    }

    function getPostData(account) {
        return {
            "usercode": account.UserCode,
            "referral": account.ReferredBy,
            "activationpin": account.ActivationCode,
            submit: 'Submit'
        };
    }

    function next() {
        if (!$scope.stopEncoding)
            $timeout(makeNextRequest, 500);
        else
            $scope.isDone = true;
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
                    log('No connection. Verify application is running.');
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
                    } else {
                        CommonFunc.PopError("Failed encoding of User code : " + account.UserCode);
                        account.WasEncoded = 'Account already exist, please try again' == account.Status.trim();
                    }
                    if (success && self.currentRequestIndex < $scope.accounts.length) {
                        next();
                    } else
                        $scope.isDone = true;
                }
            }).error(function (data, status) {
                account.EncodeBtn = "Encode";
                if (status == 0) {
                    log('No connection. Verify application is running.');
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
            account.WasEncoded = false;
            account.Status = message;
        } else if ((m = /([a-zA-Z0-9, -]*successfully[a-zA-Z ]*)/i.exec(response)) !== null) {
            var message = m[1];
            account.Status = message;
            account.WasEncoded = true;
            account.IsError = false;
            account.IsSuccess = true;
        } else if (response.indexOf("max_user_connections") > -1) {
            account.Status = "User hpidirec_admin already has more than 'max_user_connections' active connections";
            account.WasEncoded = false;
            log("User hpidirec_admin already has more than 'max_user_connections' active connections");
        } else if (/Please login first/i.exec(response)) {
            account.Status = "Your session has been expired. Please re-login again and comeback to this page. Meaning nalogout ka sa na sa system";
            log("Please login first");
            CommonFunc.PopError("Please login first");
        } else {
            account.Status = "cannot determine the response of the server.";
            log("User code '" + account.UserCode + "' was send to server but the server did not respond properly or the status is different");
            log(response);
        }

        return account.WasEncoded;
    }

    function log(msg) {
        $scope.logs.push(CommonFunc.getCurrentTime() + " : " + msg);
        console.log(msg);
    }
});