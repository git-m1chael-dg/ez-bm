/*hide the existing form*/
$('#page-wrapper > div.col-lg-12 > div').hide();

$('#page-wrapper > div.col-lg-12').after("<div ng-controller='hpiEncoderController'><hpi-encoder></hpi-encoder></div>");


var app = angular.module('bookmarklet', ['toaster','ngSanitize', 'ngCsv','hpi-encoder']);

app.run(function ($rootScope) {
    $rootScope.URL = location.href;
});