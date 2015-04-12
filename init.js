var div = document.createElement('div');
div.setAttribute('ng-controller', 'hpiEncoderController');


div.innerHTML = '<hpi-encoder></hpi-encoder>';

var body = document.getElementsByTagName("body")[0];
body.insertBefore(div, body.childNodes[0]);

/*hide the existing form*/
var form = document.getElementsByTagName("form")[0];
form.setAttribute('ng-hide', 'true');


var app = angular.module('bookmarklet', ['toaster','ngSanitize', 'ngCsv','hpi-encoder']);

app.run(function ($rootScope) {
    $rootScope.URL = location.href;
}).config(['$httpProvider', function ($httpProvider) {
        // Intercept POST requests, convert to standard form encoding
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                }
            }
            return result.join("&");
        });
    }]);