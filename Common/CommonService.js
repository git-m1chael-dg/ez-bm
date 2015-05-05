hpiModule.service('CommonFunc', function ($http,toaster) {
        var commonFunc = function($http,toaster) {
            var self = this;

            self.version =  function(){
              return "1.3";
            };

            self.validateActivationCode = function (account) {

                account.ActivationCode = account.ActivationCode.trim();
                if (/[A-Z0-9]{11}0/i.test(account.ActivationCode)) {
                    //try to correct it
                    account.ActivationCode = self.setCharAt(account.ActivationCode, 11, "O");
                }
                if (/[A-Z]{2}0[A-Z0-9]{9}/i.test(account.ActivationCode)) {
                    //try to correct it
                    account.ActivationCode = self.setCharAt(account.ActivationCode, 2, "O");
                }
                if (/[A-Z]{2}0\d{6}[A-Z]{2}0/i.test(account.ActivationCode)) {
                    //try to correct it
                    account.ActivationCode = self.setCharAt(account.ActivationCode, 2, 'O');

                    account.ActivationCode = self.setCharAt(account.ActivationCode, 11, 'O');
                }
                //valid code
                if (/[A-Z]{3}\d{6}[A-Z]{3}/i.test(account.ActivationCode)) {
                    if (account.Status == "Invalid activation code")
                        account.Status = "";
                    return true;
                }

                account.Status = "Invalid activation code";
                return false;


            };

            self.validateActivationCodes = function (accounts) {
                var isValid = true;

                angular.forEach(accounts, function (account) {
                    if (!self.validateActivationCode(account))
                        isValid = false;
                });

                return isValid;
            };

            self.countInvalidCodes = function (accounts) {
                var count = 0;

                angular.forEach(accounts, function (account) {
                    if (account.Status == "Invalid activation code")
                        count++;;
                });

                return count;
            };


            self.setCharAt = function (str, index, chr) {
                if (index > str.length - 1) return str;
                return str.substr(0, index) + chr + str.substr(index + 1);
            };

            self.PopWarning = function (msg) {
                toaster.pop({
                    type: 'warning',
                    title: 'tatae ako',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.PopError = function (msg) {
                toaster.pop({
                    type: 'error',
                    title: 'teka may error',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.PopSuccess = function (msg) {
                toaster.pop({
                    type: 'success',
                    title: 'ooppss',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.getArrayForCsv = function (accounts) {
                var list = [];

                angular.forEach(accounts, function (account) {
                    list.push({
                        UserCode: account.UserCode,
                        ReferredBy: account.ReferredBy,
                        ActivationCode: account.ActivationCode
                    });
                });

                return list;
            };

            self.isSelectedAll = function (accounts) {
                for (var i = 0; i < accounts.length; i++) {
                    if (!accounts[i].Selected)
                        return false;
                }
                return true;
            };

            self.determineDelimiter  = function (allTextLines) {
                var countTab = 0;
                var countComma = 0;
                for (var i = 0; i < allTextLines.length && i < 5; i++) {
                    if(allTextLines[i].indexOf(',') > -1)
                        countComma++;
                    if(allTextLines[i].indexOf('\t') > -1)
                        countTab++;
                }

                return countComma > countTab ? ',' : '\t';
            };

            self.isValidControlById = function (id,name,placeholder) {
                var element = document.getElementById(id);
                return element && element.getAttribute("name") == name &&
                    element.getAttribute("placeholder") == placeholder;
            };

            self.getCurrentTime = function () {
                var currentTime = new Date();
                var time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
                return time;
            };

        };

        return new commonFunc($http,toaster);
    });