/**
 * redirect javascript bookmarklet
 */
// javascript:location.href='http://example.com/?uri='+encodeURIComponent(location.href)

/**
 * bookmarklet loaded on site
 */
(function(){

    // Load the script from url and when it's ready loading run the callback.
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;

        // Attach handlers for all browsers
        var done = false;
        script.onload = script.onreadystatechange = function() {
            if(
                !done && (
                    !this.readyState ||
                        this.readyState === 'loaded' ||
                        this.readyState === 'complete')
                ) {
                done = true;

                // Continue your code
                callback();

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                document.head.removeChild(script);
            }
        };

        document.head.appendChild(script);
    }

    // Load a list of scripts *one after the other* and run cb
    var loadScripts = function(scripts, cb) {
        var script;
        if(scripts.length) {
            script = scripts.shift();
            loadScript(script, function(){
                loadScripts(scripts.slice(0), cb);
            });
        } else {
            if (cb) { cb(); }
        }
    };

    var loadStyles = function(csss) {
        var css, _i, _len;
        for (_i = 0, _len = csss.length; _i < _len; _i++) {
            css = csss[_i];
            var e = document.createElement('link');
            e.setAttribute('rel','stylesheet');
            e.setAttribute('href', css);
            document.head.appendChild(e);
        }
    };

    var prod = false;
    var appRoot = prod ? 'http://ez-bm.apphb.com/' : 'http://localhost:63342/ez-bm/';


    // Loading style definitions
    loadStyles([
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.9/toaster.min.css"
    ]);

    // Loading the scripts
    loadScripts([
        "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js",
        "https://code.angularjs.org/1.2.0/angular-animate.min.js",
        "https://code.angularjs.org/1.2.0/angular-sanitize.min.js",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/angularjs-toaster/0.4.9/toaster.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/ng-csv/0.3.2/ng-csv.min.js",
        appRoot + 'init.js',
        appRoot + 'Common/models.js',
        appRoot + 'Common/CommonService.js',
        appRoot + 'ReEntry/template.js',
        appRoot + 'ReEntry/Directives.js',
        appRoot + 'ReEntry/ReEntryCtrl.js',
        appRoot + 'NewEntry/template.js',
        appRoot + 'NewEntry/Directives.js',
        appRoot + 'NewEntry/NewEntryCtrl.js',
        appRoot + 'AdvanceCode/template.js',
        appRoot + 'AdvanceCode/Directives.js',
        appRoot + 'AdvanceCode/AdvanceCodeCtrl.js',
        appRoot + 'Dashboard/template.js',
        appRoot + 'Dashboard/Directives.js',
        appRoot + 'Dashboard/DashboardCtrl.js'
    ], function() {
        // Manual Initialization of angular app
        if (!angular.element(document).injector()) {
            angular.element(document).ready(function () {
                angular.bootstrap(document, ['bookmarklet']);
            });
        }
    });

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-30142282-2', 'auto');
    ga('send', 'pageview');
})();