/*hide the existing form*/


//$('#page-wrapper > div.col-lg-12').after("<div ng-controller='hpiEncoderController'><hpi-encoder></hpi-encoder></div>");

if(/oneclick.php/i.test(location.href)){
    $('#page-wrapper > div.col-lg-8').hide();
    $('#page-wrapper > div.col-lg-4').hide();

    $('#page-wrapper').append("<div ng-controller='AdvanceCodeCtrl'><advance-Code></advance-Code></div>");
}else if(/easyencoding.php/i.test(location.href)) {
    $('div.container > div.row').hide();
    $('div.container').prepend("<div class='row' ng-controller='NewEntryCtrl'><new-Entry></new-Entry></div>");
}else if(/easyencoding-reentry.php/i.test(location.href)) {
    $('#page-wrapper > div > div').hide();
    $('#page-wrapper > div.container').prepend("<div class='row' ng-controller='ReEntryCtrl'><re-Entry></re-Entry></div>");
}else if(location.href == "http://hpidirectsales.ph/hpi_dashboard/" || "http://hpidirectsales.ph/hpi_dashboard/index.php" == location.href) {
    $('div.col-md-4.col-md-offset-4').hide();
    $('body > div > div').append("<div ng-controller='DashboardCtrl'><dashboard></dashboard></div>");
}else if(location.href == "http://hpidirectsales.ph/hpi_dashboard/one_login.php") {
    $('div.col-md-4.col-md-offset-4').hide();
    $('body > div > div').append("<div ng-controller='OneDashboardCtrl'><one-Dashboard></one-Dashboard></div>");
}else
    $('body').after('<div class=\"navbar-fixed-top\"><h1>WRONG PAGE!</h1></div>');

var app = angular.module('bookmarklet', ['toaster','ngSanitize', 'ngCsv','hpi-encoder']);

app.run(function ($rootScope) {
    $rootScope.URL = location.href;
});

var hpiModule = angular.module('hpi-encoder',[]);

hpiModule.directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if(inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if(capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);  // capitalize initial value
        }
    };
});