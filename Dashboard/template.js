var dashboardTemplate="";
dashboardTemplate += "<toaster-container toaster-options=\"{'time-out': 3000}\"><\/toaster-container>";
dashboardTemplate += "";
dashboardTemplate += "<div>";
dashboardTemplate += "    <div class=\"row clearfix\">";
dashboardTemplate += "        <div class=\"col-md-12 column\">";
dashboardTemplate += "            <b>HPI Encoder ver {{version}}<\/b>";
dashboardTemplate += "        <\/div>";
dashboardTemplate += "    <\/div>";
dashboardTemplate += "    <div class=\"row clearfix\" ng-hide=\"isInputFieldsAreValid\">";
dashboardTemplate += "        <div class=\"col-md-12 column\">";
dashboardTemplate += "            WARNING : the input fields were change since the last update. Pls contact Mike to fix this. You know";
dashboardTemplate += "            where you can find me.";
dashboardTemplate += "        <\/div>";
dashboardTemplate += "    <\/div>";
dashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
dashboardTemplate += "        <div class=\"col-md-12 column\">";
dashboardTemplate += "            <div class=\"panel panel-default\">";
dashboardTemplate += "                <div class=\"panel-heading\">";
dashboardTemplate += "                    <h3 class=\"panel-title\">";
dashboardTemplate += "                        Step 1 : Input the CSV to parse";
dashboardTemplate += "                    <\/h3>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "                <div class=\"panel-body\">";
dashboardTemplate += "                    <form role=\"form\">";
dashboardTemplate += "                        <div class=\"form-group\">";
dashboardTemplate += "                            <label for=\"csvText\">Paste CSV content here<\/label>";
dashboardTemplate += "                            <textarea class=\"form-control\" id=\"csvText\" ng-model=\"csvContent\"><\/textarea>";
dashboardTemplate += "                        <\/div>";
dashboardTemplate += "                        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
dashboardTemplate += "                            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Parse()\">Parse<\/button>";
dashboardTemplate += "                            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"csvContent=''\">Clear<\/button>";
dashboardTemplate += "                        <\/div>";
dashboardTemplate += "                        <span ng-show=\"parseMessage!=''\" class=\"text-danger\">{{parseMessage}}<\/span>";
dashboardTemplate += "                    <\/form>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "            <\/div>";
dashboardTemplate += "        <\/div>";
dashboardTemplate += "    <\/div>";
dashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
dashboardTemplate += "        <div class=\"col-md-12 column\">";
dashboardTemplate += "            <div class=\"panel panel-default\">";
dashboardTemplate += "                <div class=\"panel-heading\">";
dashboardTemplate += "                    <h3 class=\"panel-title\">";
dashboardTemplate += "                        Step 2 : User Dasboard";
dashboardTemplate += "                    <\/h3>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "                <div class=\"panel-body\">";
dashboardTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
dashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Download()\" ng-disabled=\"!isDone\">Download All";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"StopEncoding()\">Stop";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\" filename=\"dashboard.csv\"";
dashboardTemplate += "                                csv-header=\"['Username', 'TotalQB', 'Rebates', 'TotalProductVoucher','ActiveAccnt','NewEntry','ReadyRorEncashment','EncashmentHistory']\">Export";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                    <\/div>";
dashboardTemplate += "                    <table class=\"table\">";
dashboardTemplate += "                        <thead>";
dashboardTemplate += "                        <tr>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                #";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                User Name";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Password";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Total QB";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Total Rebates";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Total Product Voucher";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Active Accounts";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                NewEntry Code";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Ready Ror Encashment";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Encashment History";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                Status";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                    <input type=\"checkbox\" ng-change=\"selectAllFn(selectAll)\"";
dashboardTemplate += "                                           ng-checked=\"isSelectedAll()\" ng-model=\"selectAll\"\/> Skip?";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                            <th>";
dashboardTemplate += "";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                        <\/tr>";
dashboardTemplate += "                        <\/thead>";
dashboardTemplate += "                        <tbody>";
dashboardTemplate += "                        <tr ng-repeat=\"user in users\">";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.Index}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                <input type=\"input\" ng-model=\"user.UserName\"\/>";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                <input type=\"input\" ng-model=\"user.Password\"\/>";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.TotalQB}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.TotalRebates}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.TotalProductVoucher}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.ActiveAccnt}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.NewEntry}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td ng-class=\"{info: user.HasBlue}\">";
dashboardTemplate += "                                {{user.ReadyRorEncashment}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                {{user.EncashmentHistory}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td ng-class=\"{danger: user.IsError, success: user.IsSuccess}\">";
dashboardTemplate += "                                {{user.Status}}";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                <input type=\"checkbox\" ng-model=\"user.WasDownloaded\"\/>";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                            <td>";
dashboardTemplate += "                                <button ng-click=\"LoginToDownloadOneItem(user)\" ng-disabled=\"!isDone\">";
dashboardTemplate += "                                    {{user.DownloadBtn}}";
dashboardTemplate += "                                <\/button>";
dashboardTemplate += "                            <\/td>";
dashboardTemplate += "                        <\/tr>";
dashboardTemplate += "                        <\/tbody>";
dashboardTemplate += "                    <\/table>";
dashboardTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
dashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Download()\" ng-disabled=\"!isDone\">Download All";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"Stop()\">Stop";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\" filename=\"dashboard.csv\"";
dashboardTemplate += "                                csv-header=\"['Username', 'TotalQB', 'Rebates', 'TotalProductVoucher','ActiveAccnt','NewEntry','ReadyRorEncashment','EncashmentHistory']\">Export";
dashboardTemplate += "                        <\/button>";
dashboardTemplate += "                    <\/div>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "            <\/div>";
dashboardTemplate += "        <\/div>";
dashboardTemplate += "    <\/div>";
dashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
dashboardTemplate += "        <div class=\"col-md-12 column\">";
dashboardTemplate += "            <div class=\"panel panel-default\">";
dashboardTemplate += "                <div class=\"panel-heading\">";
dashboardTemplate += "                    <h3 class=\"panel-title\">";
dashboardTemplate += "                        Logs";
dashboardTemplate += "                    <\/h3>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "                <div class=\"panel-body\">";
dashboardTemplate += "                    <table>";
dashboardTemplate += "                        <tr ng-repeat=\"log in logs.slice().reverse() track by $index\">";
dashboardTemplate += "                            <th>";
dashboardTemplate += "                                {{log}}";
dashboardTemplate += "                            <\/th>";
dashboardTemplate += "                        <\/tr>";
dashboardTemplate += "                    <\/table>";
dashboardTemplate += "                <\/div>";
dashboardTemplate += "            <\/div>";
dashboardTemplate += "        <\/div>";
dashboardTemplate += "    <\/div>";
dashboardTemplate += "<\/div>";
dashboardTemplate += "";
