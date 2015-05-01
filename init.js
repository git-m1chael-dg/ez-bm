/*hide the existing form*/
$('div.col-lg-12 > div').hide();

//$('#page-wrapper > div.col-lg-12').after("<div ng-controller='hpiEncoderController'><hpi-encoder></hpi-encoder></div>");

if(/oneclick.php/i.test(location.href))
    $('div.col-lg-12').prepend("<div ng-controller='AdvanceCodeCtrl'><hpi-encoder></hpi-encoder></div>");
else if(/easyencoding.php/i.test(location.href))
    $('div.col-lg-12').prepend("<div ng-controller='NewEntryCtrl'><hpi-encoder></hpi-encoder></div>");
else if(/easyencoding-reentry.php/i.test(location.href))
    $('#page-wrapper > div.col-lg-12').prepend("<div ng-controller='ReEntryCtrl'><re-Entry></re-Entry></div>");
else
    $('body').after('wrong page!');



var app = angular.module('bookmarklet', ['toaster','ngSanitize', 'ngCsv','hpi-encoder']);

app.run(function ($rootScope) {
    $rootScope.URL = location.href;
});

var hpiModule = angular.module('hpi-encoder',[]);