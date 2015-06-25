hpiModule.controller('DashboardCtrl', function ($scope, $http, $timeout, toaster, CommonFunc) {

    var self = this;
    self.LoginUrl = "http://hpidirectsales.ph/hpi_dashboard/index.php";
    self.DahsboardUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/index.php";
    self.WalletUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/wallet.php";
    self.MyEarningUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/myearnings.php";
    self.ReadyForEncashmentUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/ready-for-encashment.php";
    self.EncashmentHistoryUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/encashment-history.php";
    self.ActiveAndInActiveAccntUrl = "http://hpidirectsales.ph/hpi_dashboard/pages/newly-encoded.php";

    self.currentRequestIndex = 0;

    $scope.version = CommonFunc.version();
    $scope.stopTask = true;
    $scope.isDone = true;


    $scope.selectAll = false;
    $scope.isInputFieldsAreValid = inputFieldsAreValid();

    $scope.csvContent = '';
    $scope.users = [];

    $scope.parseMessage = '';
    $scope.logs = [];
    $scope.Parse = function () {

        saveData();

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
            else {
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
        user.DownloadBtn = "Downloading..";

        var postData = getPostData(user);

        $http.post(self.LoginUrl, postData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status) {
            var success = false;
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                success = isSuccess(user, data);
                if (success) {
                    DownloadDashboard(user, false);
                    log("Logg-in successfully for user : " + user.UserName);
                } else {
                    CommonFunc.PopError("Logg-in failed for user : " + user.UserName);
                }
            }
            if (success == false) {
                $scope.isDone = true;
                user.DownloadBtn = "Download";
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
            user.DownloadBtn = "Download";
            CommonFunc.PopError("Failure. User : " + user.UserName);
        });

    };

    $scope.selectAllFn = function (selectAll) {
        angular.forEach($scope.users, function (user) {
            user.WasDownloaded = selectAll;
        });
    };
    $scope.isSelectedAll = function () {
        for (var i = 0; i < $scope.users.length; i++) {
            if (!$scope.users[i].WasDownloaded)
                return false;
        }
        return true;
    };

    $scope.getArrayForCsv = function () {
        var list = [];

        angular.forEach($scope.users, function (account) {
            list.push({
                Username: account.UserName,
                TotalQB: account.TotalQB,
                Rebates: account.TotalRebates,
                TotalProductVoucher: account.TotalProductVoucher,
                ActiveAccnt: account.ActiveAccnt,
                NewEntry: account.NewEntry,
                ReadyRorEncashment: account.ReadyRorEncashment,
                EncashmentHistory: account.EncashmentHistory
            });
        });

        return list;
    };

    function loadData() {
        if (!supportsLocalStorage()) {
            return;
        }

        $scope.csvContent = localStorage["ez-bm.users"];
    }

    loadData();

    function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function saveData() {
        if (!supportsLocalStorage()) {
            return;
        }

        localStorage["ez-bm.users"] = $scope.csvContent;
    }

    function inputFieldsAreValid() {
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

    function TransformToFormData(jsonData) {
        var key, result = [];
        for (key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                result.push(encodeURIComponent(key) + "=" + encodeURIComponent(jsonData[key]));
            }
        }
        return result.join("&");
    }

    function next() {
        if (!$scope.stopTask)
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
            user.DownloadBtn = "Downloading...";

            var postData = getPostData(user);

            LogInToDashboard(user, postData);
        } else {
            $scope.isDone = true;
            $scope.stopTask = false;
        }
    }

    function LogInToDashboard(user, postData) {

        $http.post(self.LoginUrl, postData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status) {
            var success = false;
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                success = isSuccess(user, data);
                if (success) {
                    user.Status = 'login success';
                    log("Login success for user: " + user.UserName);
                    DownloadDashboard(user, true);
                } else {
                    CommonFunc.PopError("Login failed for user: " + user.UserName);
                }
            }
            if (success == false) {
                $scope.isDone = true;
                user.DownloadBtn = "Download";
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
            user.DownloadBtn = "Download";
            CommonFunc.PopError("Failure. User : " + user.UserName);
        });
    }

    function isSuccess(user, response) {
        user.IsError = true;
        user.IsSuccess = false;
        if (/location.href="pages/i.exec(response)) {
            user.IsError = false;
            return true;
        } else if (response.indexOf("max_user_connections") > -1) {
            user.Status = "User hpidirec_admin already has more than 'max_user_connections' active connections";
            log("User hpidirec_admin already has more than 'max_user_connections' active connections");
        } else if (response.indexOf("Username or Password is Incorrect") > -1) {
            user.Status = "Username or Password is Incorrect";
            log("Username or Password is Incorrect");
        } else {
            user.Status = "cannot determine the response of the server.";
            log("User user '" + user.UserName + "' was send to server but the server did not respond properly or the status is different");
            log(response);
        }

        return false;
    }

    function log(msg) {
        $scope.logs.push(CommonFunc.getCurrentTime() + " : " + msg);
        console.log(msg);
    }

    var downloadState = new DownloadState();
    function DownloadDashboard(user, proceedToNext) {

        log("Downloading user's dashboard. User : " + user.UserName);

        downloadState = new DownloadState();

        getData(self.DahsboardUrl, function (data,status) {
            downloadState.Dashboard = true;
            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.ActiveAccnt = $('#income-summary > tbody > tr', el).length;

                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }

        }, function (data,status) {
            downloadState.Dashboard = true;
            DownloadErrorHandle(user);
        });

        getData(self.WalletUrl, function (data,status) {
            downloadState.Wallet = true;
            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.Wallet = $('#maturitybonus', el).text();

                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }

        }, function (data,status) {
            downloadState.Wallet = true;
            DownloadErrorHandle(user);
        });

        getData(self.MyEarningUrl, function (data,status) {
            downloadState.MyEarning = true;
            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.TotalQB = $('#MBonus > h4 > span', el).text();
                user.TotalRebates = $('#Rbonus > h4 > span', el).text() + "(" + $('#Rbonus > table > tbody > tr:last-child > td:nth-child(1)', el).text() + "/" + $('#Rbonus > table > tbody > tr:last-child > td:nth-child(2)', el).text() + ")";
                user.TotalProductVoucher = $('#Pvouchers > h4 > span', el).text();

                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }

        }, function (data,status) {
            downloadState.MyEarning = true;
            DownloadErrorHandle(user);
        });

        getData(self.ReadyForEncashmentUrl, function (data,status) {
            downloadState.ReadyForEncashment = true;
            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.ReadyRorEncashment = $('#income-summary > tbody > tr', el).length;

                if (user.ReadyRorEncashment && user.ReadyRorEncashment != 0) {
                    user.HasBlue = true;
                    user.Status = "Blue Na!!";
                } else
                    user.ReadyRorEncashment = '-';

                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }

        }, function (data,status) {
            downloadState.ReadyForEncashment = true;
            DownloadErrorHandle(user);
        });

        getData(self.EncashmentHistoryUrl, function (data,status) {
            downloadState.EncashmentHistory = true;

            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.EncashmentHistory = $('#income-summary > tbody > tr', el).length;
                if (user.EncashmentHistory == 0) {
                    user.EncashmentHistory = '-';
                }

                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }
        }, function (data,status) {
            downloadState.EncashmentHistory = true;
            DownloadErrorHandle(user);
        });

        getData(self.ActiveAndInActiveAccntUrl, function (data,status) {
            downloadState.ActiveAccnt = true;
            if(status==200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                user.NewEntry = $('#income-summary > tbody > tr', el).length;
                if (user.NewEntry == 0) {
                    user.NewEntry = '-';
                }
                DoNextIfAllDownloaded(proceedToNext,true,user);
            }else{
                DoNextIfAllDownloaded(proceedToNext,false,user);
            }

        }, function (data,status) {
            downloadState.ActiveAccnt = true;
            DownloadErrorHandle(user);
        });
    }

    function DownloadErrorHandle(user){
        log("Failure. User : " + user.UserName);
        $scope.isDone = true;
        user.DownloadBtn = "Download";
        CommonFunc.PopError("Failure. Fetching the dashboard info of user : " + user.UserName);
    }
    function DoNextIfAllDownloaded(proceedToNext,isSuccessful,user){

        if(downloadState.AllDownloaded()) {
            if(isSuccessful) {
                //clean up
                if (user.TotalRebates.trim() == "P(/)")
                    user.TotalRebates = "-";
                if (user.TotalQB.trim() == "P")
                    user.TotalQB = "-";
                if (user.TotalProductVoucher.trim() == "Php.")
                    user.TotalProductVoucher = "-";

                user.WasDownloaded = true;
                user.IsSuccess = true;
                user.DownloadBtn = "Download";
                if (proceedToNext) {
                    self.currentRequestIndex++;

                    if (self.currentRequestIndex < $scope.users.length) {
                        next();
                    } else
                        $scope.isDone = true;
                } else
                    $scope.isDone = true;
            }else
                $scope.isDone = true;
        }

    }
    function getData(url, success, error) {

        $http.get(url)
            .success(function (data, status) {

                if (status == 0) {
                    log('No connection. Verify application is running.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                }
                success(data,status);

            })
            .error(function (data, status) {
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
                error(data,status);

            });
    }
});