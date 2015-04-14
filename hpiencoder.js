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

    var prod = true;
    var appRoot = prod ? 'http://ez-bm.apphb.com/' : 'http://localhost:800/ez-bm/';


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
        appRoot + 'template.js',
        appRoot + 'controller.js'
    ], function() {
        // Manual Initialization of angular app
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['bookmarklet']);
        });
    });

})();