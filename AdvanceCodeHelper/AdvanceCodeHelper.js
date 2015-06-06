var advnceTemplate = "";
advnceTemplate += "<div>";
advnceTemplate += "    <div class=\"row clearfix\">";
advnceTemplate += "        <div class=\"col-md-8 column\">";
advnceTemplate += "            <div class=\"panel panel-default\">";
advnceTemplate += "                <div class=\"panel-body\">";
advnceTemplate += "                        <div class=\"form-group\">";
advnceTemplate += "                            <label for=\"csvText\">Paste CSV content here<\/label>";
advnceTemplate += "                            <textarea class=\"form-control\" id=\"csvText\"><\/textarea>";
advnceTemplate += "                        <\/div>";
advnceTemplate += "                        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
advnceTemplate += "                            <a type=\"submit\" class=\"btn btn-primary\" id=\"parse\">Parse<\/a>";
advnceTemplate += "                            <a type=\"submit\" class=\"btn btn-default\" id=\"clear\">Clear<\/a>";
advnceTemplate += "                        <\/div>";
advnceTemplate += "                <\/div>";
advnceTemplate += "            <\/div>";
advnceTemplate += "        <\/div>";
advnceTemplate += "    <\/div>";
advnceTemplate += "<\/div>";

function Account(userCode, referredBy, activationCode) {
    var self = this;
    self.UserCode = userCode;
    self.ReferredBy = referredBy;
    self.ActivationCode = activationCode;

    self.MakeUpperCase = function () {
        self.UserCode = self.UserCode.toUpperCase();
        self.ReferredBy = self.ReferredBy.toUpperCase();
        self.ActivationCode = self.ActivationCode.toUpperCase();
    }
}


$('#page-wrapper').append(advnceTemplate);

var self={};

$('#parse').click(function () {
    var allTextLines = $('#csvText').val().split(/\r\n|\n/);
    self.accounts = [];


    var delimiter = '\t';
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(delimiter);
        if (data.length >= 3 && data[0] && data[1] && data[2]) {
            self.accounts.push(new Account(data[0], data[1], data[2]));
        }
    }

    //populate the input box
    for (var count = 1; count < self.accounts.length; count++)
        $('.my-form .add-box').click();

    $.each($('.text-box'), function (index, el) {
        var account = self.accounts[index];

        var textBox = $('.inputroll', el);
        $(textBox[0]).val(account.UserCode);
        $(textBox[1]).val(account.ReferredBy);
        $(textBox[2]).val(account.ActivationCode);
    });
});

$('#clear').click(function () {
    $('#csvText').val('');

    $('.my-form .remove-box').click();
});
