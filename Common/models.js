function Account(index, userCode, referredBy, activationCode, status, wasEncoded) {
    var self = this;
    self.Index = index;
    self.UserCode = userCode;
    self.ReferredBy = referredBy;
    self.ActivationCode = activationCode;
    self.Status = status;
    self.WasEncoded = wasEncoded;

    self.IsError = false;
    self.IsSuccess = false;

    self.MakeUpperCase = function () {
        self.UserCode = self.UserCode.toUpperCase();
        self.ReferredBy = self.ReferredBy.toUpperCase();
        self.ActivationCode = self.ActivationCode.toUpperCase();
    }
}

function User(index, userName, password) {
    var self = this;
    self.Index = index;
    self.UserName = userName;
    self.Password = password;
    self.Status = '';

    self.TotalQB = '';
    self.TotalRebates  = '';
    self.TotalProductVoucher = '';
    self.Wallet = '';
    self.NewEntry = '';
    self.ReadyRorEncashment  = '';
    self.EncashmentHistory  = '';
    self.ActiveAccnt = '';

    self.IsError = false;
    self.IsSuccess = false;
    self.WasDownloaded = false;
    self.HasBlue = false;
    self.Loading = false;

    self.DownloadBtn = "Download";
}


function DownloadState(){
    var self = this;
    self.Dashboard=false;
    self.ReadyForEncashment=false;
    self.EncashmentHistory=false;
    self.ActiveAccnt=false;
    self.Wallet=false;
    self.MyEarning=false;
    self.AllDownloaded = function(){
        return self.Dashboard && self.ReadyForEncashment && self.EncashmentHistory && self.ActiveAccnt && self.Wallet && self.MyEarning;
    };
};
