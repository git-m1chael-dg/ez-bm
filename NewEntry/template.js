var newEntryTemplate="";
newEntryTemplate += "<toaster-container toaster-options=\"{'time-out': 3000}\"><\/toaster-container>";
newEntryTemplate += "";
newEntryTemplate += "<div>";
newEntryTemplate += "    <div class=\"row clearfix\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            <b>HPI Encoder ver {{version}}<\/b>";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "    <div class=\"row clearfix\" ng-hide=\"isInputFieldsAreValid\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            WARNING : the input fields were change since the last update. Pls contact Mike to fix this. You know";
newEntryTemplate += "            where you can find me.";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            <div class=\"panel panel-default\">";
newEntryTemplate += "                <div class=\"panel-heading\">";
newEntryTemplate += "                    <h3 class=\"panel-title\">";
newEntryTemplate += "                        Step 1 : Input the CSV to parse";
newEntryTemplate += "                    <\/h3>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "                <div class=\"panel-body\">";
newEntryTemplate += "                    <form role=\"form\">";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"csvText\">Paste CSV content here<\/label>";
newEntryTemplate += "                            <textarea class=\"form-control\" id=\"csvText\" ng-model=\"csvContent\"><\/textarea>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
newEntryTemplate += "                            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Parse()\">Parse<\/button>";
newEntryTemplate += "                            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"csvContent=''\">Clear<\/button>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <span ng-show=\"parseMessage!=''\" class=\"text-danger\">{{parseMessage}}<\/span>";
newEntryTemplate += "                    <\/form>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "            <\/div>";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            <div class=\"panel panel-default\">";
newEntryTemplate += "                <div class=\"panel-heading\">";
newEntryTemplate += "                    <h3 class=\"panel-title\">";
newEntryTemplate += "                        Step 2 : Input user information";
newEntryTemplate += "                    <\/h3>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "                <div class=\"panel-body\">";
newEntryTemplate += "                    <form role=\"form\" class=\"form-horizontal\">";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"uplineUserCode\" class=\"col-sm-2 control-label\">Upline User Code<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"uplineUserCode\" class=\"form-control\"";
newEntryTemplate += "                                       placeholder=\"Your Upline User Code\" ng-model=\"uplineUserCode\" capitalize\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"firstName\" class=\"col-sm-2 control-label\">First Name<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"firstName\" class=\"form-control\" placeholder=\"First Name\"";
newEntryTemplate += "                                   ng-model=\"firstName\" capitalize\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"form-group\" ng-show=\"false\">";
newEntryTemplate += "                            <label for=\"middleName\" class=\"col-sm-2 control-label\">Middle Name<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"middleName\" class=\"form-control\" placeholder=\"Middle Name\"";
newEntryTemplate += "                                   ng-model=\"middleName\" capitalize\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"lastName\" class=\"col-sm-2 control-label\">Last Name<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"lastName\" class=\"form-control\" placeholder=\"Last Name\"";
newEntryTemplate += "                                   ng-model=\"lastName\" capitalize\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"userPassword\" class=\"col-sm-2 control-label\">User Password<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"userPassword\" class=\"form-control\" placeholder=\"User Password\"";
newEntryTemplate += "                                   ng-model=\"password\"\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                        <div class=\"form-group\">";
newEntryTemplate += "                            <label for=\"txtTeam\" class=\"col-sm-2 control-label\">Team<\/label>";
newEntryTemplate += "                            <div class=\"col-sm-10\">";
newEntryTemplate += "                                <input type=\"text\" id=\"txtTeam\" class=\"form-control\"";
newEntryTemplate += "                                       ng-model=\"teamDisplay\" disabled\/>";
newEntryTemplate += "                            <\/div>";
newEntryTemplate += "                        <\/div>";
newEntryTemplate += "                    <\/form>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "            <\/div>";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            <div class=\"panel panel-default\">";
newEntryTemplate += "                <div class=\"panel-heading\">";
newEntryTemplate += "                    <h3 class=\"panel-title\">";
newEntryTemplate += "                        Step 3 : Correct the fields below and click Encode.";
newEntryTemplate += "                    <\/h3>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "                <div class=\"panel-body\">";
newEntryTemplate += "                    <p class=\"text-warning\">To enable encode one item, you must first check action checkbox. This is to avoid accidental click<\/p>";
newEntryTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
newEntryTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Encode()\" ng-disabled=\"!isDone\">Encode";
newEntryTemplate += "                            All";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"StopEncoding()\">Stop";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\" filename=\"encoded.csv\"";
newEntryTemplate += "                                csv-header=\"['User Code', 'Referred By', 'Activation Code']\">Export";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"EncodeBy10()\" ng-disabled=\"!isDone\">Encode By 10";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                    <\/div>";
newEntryTemplate += "                    <table class=\"table\">";
newEntryTemplate += "                        <thead>";
newEntryTemplate += "                        <tr>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                #";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                User Code";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                Referred By";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                Activation Code";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                Status";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"checkbox\" ng-change=\"selectAllFn(selectAll)\"";
newEntryTemplate += "                                       ng-checked=\"isSelectedAll()\" ng-model=\"selectAll\"\/> Was Encoded";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"checkbox\" ng-model=\"enableEncodeOneItem\"";
newEntryTemplate += "                                       alt=\"Enable Encode One By One. By default this is disable to prevent accident.\"\/>";
newEntryTemplate += "                                Action";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                        <\/tr>";
newEntryTemplate += "                        <\/thead>";
newEntryTemplate += "                        <tbody>";
newEntryTemplate += "                        <tr ng-repeat=\"account in accounts\" ng-class=\"{danger: account.IsError, success: account.IsSuccess}\">";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                {{account.Index}}";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"input\" ng-model=\"account.UserCode\" maxlength=\"20\"\/>";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"input\" ng-model=\"account.ReferredBy\" maxlength=\"20\"\/>";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"input\" ng-model=\"account.ActivationCode\"";
newEntryTemplate += "                                       ng-change=\"ActivationCodeChange(account)\"\/>";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                {{account.Status}}";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <input type=\"checkbox\" ng-model=\"account.WasEncoded\"\/>";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                <button ng-click=\"EncodeOneItem(account)\" ng-disabled=\"!isDone || !enableEncodeOneItem\">";
newEntryTemplate += "                                    {{account.EncodeBtn}}";
newEntryTemplate += "                                <\/button>";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                        <\/tr>";
newEntryTemplate += "                        <\/tbody>";
newEntryTemplate += "                    <\/table>";
newEntryTemplate += "                    <p class=\"text-warning\">To enable encode one item, you must first check action checkbox. This is to avoid accidental click<\/p>";
newEntryTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
newEntryTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Encode()\" ng-disabled=\"!isDone\">Encode";
newEntryTemplate += "                            All";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"StopEncoding()\">Stop";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\" filename=\"encoded.csv\"";
newEntryTemplate += "                                csv-header=\"['User Code', 'Referred By', 'Activation Code']\">Export";
newEntryTemplate += "                        <\/button>";
newEntryTemplate += "                    <\/div>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "            <\/div>";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
newEntryTemplate += "        <div class=\"col-md-12 column\">";
newEntryTemplate += "            <div class=\"panel panel-default\">";
newEntryTemplate += "                <div class=\"panel-heading\">";
newEntryTemplate += "                    <h3 class=\"panel-title\">";
newEntryTemplate += "                        Logs";
newEntryTemplate += "                    <\/h3>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "                <div class=\"panel-body\">";
newEntryTemplate += "                    <table>";
newEntryTemplate += "                        <tr ng-repeat=\"log in logs.slice().reverse() track by $index\">";
newEntryTemplate += "                            <th>";
newEntryTemplate += "                                {{log}}";
newEntryTemplate += "                            <\/th>";
newEntryTemplate += "                        <\/tr>";
newEntryTemplate += "                    <\/table>";
newEntryTemplate += "                <\/div>";
newEntryTemplate += "            <\/div>";
newEntryTemplate += "        <\/div>";
newEntryTemplate += "    <\/div>";
newEntryTemplate += "<\/div>";
newEntryTemplate += "";
