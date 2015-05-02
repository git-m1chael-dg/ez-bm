/*hide the existing form*/


//$('#page-wrapper > div.col-lg-12').after("<div ng-controller='hpiEncoderController'><hpi-encoder></hpi-encoder></div>");

if(/oneclick.php/i.test(location.href)){
    $('#page-wrapper').hide();
    $('#wrapper').append("<div ng-controller='AdvanceCodeCtrl'><advance-Code></advance-Code></div>");
}else if(/easyencoding.php/i.test(location.href)) {
    $('div.col-lg-12 > div').hide();
    $('div.col-lg-12').prepend("<div ng-controller='NewEntryCtrl'><new-Entry></new-Entry></div>");
}else if(/easyencoding-reentry.php/i.test(location.href)) {
    $('div.col-lg-12 > div').hide();
    $('#page-wrapper > div.col-lg-12').prepend("<div ng-controller='ReEntryCtrl'><re-Entry></re-Entry></div>");
}else
    $('body').after('<h1 class=\"text-danger\">wrong page!</h1>h1>');



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