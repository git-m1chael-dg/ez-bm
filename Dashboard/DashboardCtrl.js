hpiModule.controller('DashboardCtrl', function ($scope, $http, $timeout,toaster,CommonFunc) {

        var self = this;
        self.PostUrl = "http://hpidirectsales.ph/hpi_dashboard/index.php";
        self.DahsboardUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/index.php";
        self.currentRequestIndex = 0;

        $scope.version = CommonFunc.version();
        $scope.stopTask = true;
        $scope.isDone = true;

        $scope.selectAll = false;
        $scope.isInputFieldsAreValid =  inputFieldsAreValid();

        $scope.csvContent = '';
        $scope.users = [];

        $scope.parseMessage = '';
        $scope.logs = [];
        $scope.Parse = function () {
            var allTextLines = $scope.csvContent.split(/\r\n|\n/);
            $scope.users = [];
            var index = 1;
            var delimiter = CommonFunc.determineDelimiter(allTextLines);
            for (var i = 0; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(delimiter);
                if (data.length >= 2 && data[0] && data[1]) {
                    $scope.users.push(new User(index, data[0], data[1]));
                    index++;
                }
                else{
                    var lineNo = i + 1;
                    CommonFunc.PopWarning("Invalid data was found  at line " + lineNo);
                    log("Invalid data was found  at line " + lineNo);
                }
            }

            $scope.parseMessage = "Parsed " + $scope.users.length + " record(s)";
        };

        $scope.Stop = function () {
            $scope.stopTask = true;
            CommonFunc.PopWarning("Stopping the current task..pls wait");
        };

        $scope.Download = function () {
            $scope.stopTask = false;
            $scope.isDone = false;
            self.currentRequestIndex = 0;
            next();
        };

        $scope.LoginToDownloadOneItem = function (user) {

            $scope.isDone = false;
            $scope.stopTask = false;

            var postData = getPostData(user);


            $http.post(self.PostUrl, postData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status) {
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
                    var success = isSuccess(user, data);
                    if (success) {
                        DownloadDashboard(user, data);
                        log("Successfully downloaded. User : " + user.UserName);
                        CommonFunc.PopSuccess("Success. User : " + user.UserCode);
                    }else{
                        CommonFunc.PopError("Failed encoding of User : " + user.UserName);
                    }
                }
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
                log("Failure. User : " + user.UserName);
                $scope.isDone = true;
                CommonFunc.PopError("Failure. User : " + user.UserName);
            });

        };

        $scope.selectAllFn = function (selectAll) {
            angular.forEach($scope.users, function (user) {
                user.WasEncoded = selectAll;
            });
        };
        $scope.isSelectedAll = function () {
            return CommonFunc.isSelectedAll($scope.users);
        };

        $scope.getArrayForCsv = function () {
            return CommonFunc.getArrayForCsv($scope.users);
        };

        function inputFieldsAreValid () {
            var isValid = true;

            if (!CommonFunc.isValidControlCheckByName("username", "User Code")) {
                log("username changed");
                isValid = false;
            }
            else if (!CommonFunc.isValidControlCheckByName("password", "Password")) {
                log("password changed");
                isValid = false;
            }

            return isValid;
        }

        function getPostData(user) {
            return TransformToFormData({
                "username": user.UserName,
                "password": user.Password,
                login: 'Login'
            });
        }
        function TransformToFormData(jsonData){
            var key, result = [];
            for (key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(jsonData[key]));
                }
            }
            return result.join("&");
        }

        function next() {
            if(!$scope.stopTask)
                $timeout(makeNextRequest, 500);
            else
                $scope.isDone = true;
        }

        function makeNextRequest() {
            if (self.currentRequestIndex < $scope.users.length) {
                var user = $scope.users[self.currentRequestIndex];
                if (user.WasDownloaded) {
                    self.currentRequestIndex++;
                    next();
                    return;
                }

                var postData = getPostData(user);

                LogInToDashboard(user, postData);
            }else{
                $scope.isDone = true;
                $scope.stopTask = false;
            }
        }

        function LogInToDashboard(user, postData) {

            $http.post(self.PostUrl, postData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data, status) {

                if (status == 0) {
                    log('No connection. Verify application is running.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                } else {
                    var success = isSuccess(user, data);
                    if (success) {
                        user.Status = 'login success';
                        log("Login success for user: " + user.UserName);
                        DownloadDashboard(user, data);
                    }else{
                        CommonFunc.PopError("Login failed for user: " + user.UserName);
                        $scope.isDone = true;
                    }
                }
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
                log("Failure. User : " + user.UserName);
                $scope.isDone = true;
                CommonFunc.PopError("Failure. User : " + user.UserName);
            });
        }

        function isSuccess(user, response) {
            user.IsError = true;
            user.IsSuccess = false;
            if(/location.href="pages/i.exec(response)){
                user.IsError = false;
                user.WasDownloaded = true;
            }else if (response.indexOf("max_user_connections") > -1) {
                user.Status = "User hpidirec_admin already has more than 'max_user_connections' active connections";
                log("User hpidirec_admin already has more than 'max_user_connections' active connections");
            }else if (response.indexOf("Username or Password is Incorrect") > -1) {
                user.Status = "Username or Password is Incorrect";
                log("Username or Password is Incorrect");
            }else{
                user.Status = "cannot determine the response of the server.";
                log("User user '" + user.UserName + "' was send to server but the server did not respond properly or the status is different");
                log(response);
            }

            return user.WasDownloaded;
        }

        function log(msg) {
            $scope.logs.push(CommonFunc.getCurrentTime() + " : " + msg);
            console.log(msg);
        }

        function DownloadDashboard(user) {

            log("Downloading user's dashboard. User : " + user.UserName);

            $http.get(self.DahsboardUrl)
                .success(function (data, status) {

                    if (status == 0) {
                        log('No connection. Verify application is running.');
                    } else if (status == 401) {
                        log('Unauthorized');
                    } else if (status == 405) {
                        log('HTTP verb not supported [405]');
                    } else if (status == 500) {
                        log('Internal Server Error [500].');
                    } else {
                        ParseDashboardData(user, data);

                        self.currentRequestIndex++;

                        if (self.currentRequestIndex < $scope.users.length) {
                            next();
                        } else
                            $scope.isDone = true;
                    }
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
                    log("Failure. User : " + user.UserName);
                    $scope.isDone = true;
                    CommonFunc.PopError("Failure. Fetching the dashboard info of user : " + user.UserName);
                });
        }

        function ParseDashboardData(user, reponse) {
            var el = $( '<div></div>' );
            el.html(reponse);

            user.TotalQB = $('#MBonus > h4 > span',el).text();
            user.TotalRebates  = $('#Rbonus > h4 > span',el).text();
            user.TotalProductVoucher = $('#Pvouchers > h4 > span',el).text();
            user.NewEntry = $('#page-wrapper > div:nth-child(2) > div:nth-child(1) > div > a > div > span.pull-left > b',el).text();
            user.ReadyRorEncashment  = $('#page-wrapper > div:nth-child(2) > div:nth-child(2) > div > a > div > span.pull-left > b',el).text();
            user.EncashmentHistory  = $('#page-wrapper > div:nth-child(2) > div:nth-child(3) > div > a > div > span.pull-left > b',el).text();
        }
    });