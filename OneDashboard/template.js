var oneDashboardTemplate="";
oneDashboardTemplate += "<toaster-container toaster-options=\"{'time-out': 3000}\"><\/toaster-container>";
oneDashboardTemplate += "";
oneDashboardTemplate += "<div>";
oneDashboardTemplate += "    <div class=\"row clearfix\">";
oneDashboardTemplate += "        <div class=\"col-md-12 column\">";
oneDashboardTemplate += "            <b>HPI Encoder ver {{version}}<\/b>";
oneDashboardTemplate += "        <\/div>";
oneDashboardTemplate += "    <\/div>";
oneDashboardTemplate += "    <div class=\"row clearfix\" ng-hide=\"isInputFieldsAreValid\">";
oneDashboardTemplate += "        <div class=\"col-md-12 column\">";
oneDashboardTemplate += "            WARNING : the input fields were change since the last update. Pls contact Mike to fix this. You know";
oneDashboardTemplate += "            where you can find me.";
oneDashboardTemplate += "        <\/div>";
oneDashboardTemplate += "    <\/div>";
oneDashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
oneDashboardTemplate += "        <div class=\"col-md-12 column\">";
oneDashboardTemplate += "            <div class=\"panel panel-default\">";
oneDashboardTemplate += "                <div class=\"panel-heading\">";
oneDashboardTemplate += "                    <h3 class=\"panel-title\">";
oneDashboardTemplate += "                        Step 1 : Input the CSV to parse";
oneDashboardTemplate += "                    <\/h3>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "                <div class=\"panel-body\">";
oneDashboardTemplate += "                    <form role=\"form\">";
oneDashboardTemplate += "                        <div class=\"form-group\">";
oneDashboardTemplate += "                            <label for=\"csvText\">Paste CSV content here<\/label>";
oneDashboardTemplate += "                            <textarea class=\"form-control\" id=\"csvText\" ng-model=\"csvContent\"><\/textarea>";
oneDashboardTemplate += "                        <\/div>";
oneDashboardTemplate += "                        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
oneDashboardTemplate += "                            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Parse()\">Parse<\/button>";
oneDashboardTemplate += "                            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"csvContent=''\">Clear<\/button>";
oneDashboardTemplate += "                        <\/div>";
oneDashboardTemplate += "                        <span ng-show=\"parseMessage!=''\" class=\"text-danger\">{{parseMessage}}<\/span>";
oneDashboardTemplate += "                    <\/form>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "            <\/div>";
oneDashboardTemplate += "        <\/div>";
oneDashboardTemplate += "    <\/div>";
oneDashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
oneDashboardTemplate += "        <div class=\"col-md-12 column\">";
oneDashboardTemplate += "            <div class=\"panel panel-default\">";
oneDashboardTemplate += "                <div class=\"panel-heading\">";
oneDashboardTemplate += "                    <h3 class=\"panel-title\">";
oneDashboardTemplate += "                        Step 2 : User Dasboard";
oneDashboardTemplate += "                    <\/h3>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "                <div class=\"panel-body\">";
oneDashboardTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
oneDashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Download()\" ng-disabled=\"!isDone\">";
oneDashboardTemplate += "                            Download All";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"Stop()\">Stop";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\"";
oneDashboardTemplate += "                                filename=\"dashboard.csv\"";
oneDashboardTemplate += "                                csv-header=\"['Username', 'TotalQB', 'Rebates', 'TotalProductVoucher','ActiveAccnt','NewEntry','ReadyRorEncashment','EncashmentHistory']\">";
oneDashboardTemplate += "                            Export";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                    <\/div>";
oneDashboardTemplate += "                    <div class=\"row\">";
oneDashboardTemplate += "                        <div class=\"col-md-12 col-md-offset-2\">";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadActiveAccounts\"\/> Download Active";
oneDashboardTemplate += "                                    Accounts?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadReadyForEncashment\"\/> Download";
oneDashboardTemplate += "                                    Ready for Encashment Accounts?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadEncashmentHistory\" disabled\/> Download";
oneDashboardTemplate += "                                    Encashment History\/Accounts?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadInActiveAccounts\" disabled\/> Download In";
oneDashboardTemplate += "                                    Active Accounts?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadWallet\"\/> Download E-Wallet?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                            <div class=\"checkbox\">";
oneDashboardTemplate += "                                <label>";
oneDashboardTemplate += "                                    <input type=\"checkbox\" ng-model=\"settings.DownloadMyEarning\"\/> Download My Earnings?";
oneDashboardTemplate += "                                <\/label>";
oneDashboardTemplate += "                            <\/div>";
oneDashboardTemplate += "                        <\/div>";
oneDashboardTemplate += "                    <\/div>";
oneDashboardTemplate += "                    <table class=\"table\">";
oneDashboardTemplate += "                        <thead>";
oneDashboardTemplate += "                        <tr>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                #";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                User Name";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Password";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>Wallet<\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Total QB";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Total Rebates";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Total Product Voucher";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Active Accounts";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                New Entry Code";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Ready For Encashment";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Encashment History";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                Status";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                <input type=\"checkbox\" ng-change=\"selectAllFn(selectAll)\"";
oneDashboardTemplate += "                                       ng-checked=\"isSelectedAll()\" ng-model=\"selectAll\"\/> Skip?";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                        <\/tr>";
oneDashboardTemplate += "                        <\/thead>";
oneDashboardTemplate += "                        <tbody>";
oneDashboardTemplate += "                        <tr ng-repeat=\"user in users\">";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.Index}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                <input type=\"input\" ng-model=\"user.UserName\"\/>";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                <input type=\"input\" ng-model=\"user.Password\"\/>";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>{{user.Wallet}}<\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.TotalQB}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td ng-class=\"{info: user.RbIsWithInAWeek}\">";
oneDashboardTemplate += "                                {{user.TotalRebates}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.TotalProductVoucher}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.ActiveAccnt}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.NewEntry}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td ng-class=\"{info: user.HasBlue}\">";
oneDashboardTemplate += "                                {{user.ReadyRorEncashment}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                {{user.EncashmentHistory}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td ng-class=\"{danger: user.IsError, success: user.IsSuccess}\">";
oneDashboardTemplate += "                                {{user.Status}}";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                <input type=\"checkbox\" ng-model=\"user.WasDownloaded\"\/>";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                            <td>";
oneDashboardTemplate += "                                <button ng-click=\"LoginToDownloadOneItem(user)\" ng-disabled=\"!isDone\">";
oneDashboardTemplate += "                                    {{user.DownloadBtn}}";
oneDashboardTemplate += "                                <\/button>";
oneDashboardTemplate += "                            <\/td>";
oneDashboardTemplate += "                        <\/tr>";
oneDashboardTemplate += "                        <\/tbody>";
oneDashboardTemplate += "                    <\/table>";
oneDashboardTemplate += "                    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">";
oneDashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"Download()\" ng-disabled=\"!isDone\">";
oneDashboardTemplate += "                            Download All";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                        <button type=\"submit\" class=\"btn btn-danger\" ng-click=\"Stop()\">Stop";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                        <button type=\"button\" class=\"btn btn btn-default\" ng-csv=\"getArrayForCsv()\"";
oneDashboardTemplate += "                                filename=\"dashboard.csv\"";
oneDashboardTemplate += "                                csv-header=\"['Username', 'TotalQB', 'Rebates', 'TotalProductVoucher','ActiveAccnt','NewEntry','ReadyRorEncashment','EncashmentHistory']\">";
oneDashboardTemplate += "                            Export";
oneDashboardTemplate += "                        <\/button>";
oneDashboardTemplate += "                    <\/div>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "            <\/div>";
oneDashboardTemplate += "        <\/div>";
oneDashboardTemplate += "    <\/div>";
oneDashboardTemplate += "    <div class=\"row clearfix\" ng-show=\"isInputFieldsAreValid\">";
oneDashboardTemplate += "        <div class=\"col-md-12 column\">";
oneDashboardTemplate += "            <div class=\"panel panel-default\">";
oneDashboardTemplate += "                <div class=\"panel-heading\">";
oneDashboardTemplate += "                    <h3 class=\"panel-title\">";
oneDashboardTemplate += "                        Logs";
oneDashboardTemplate += "                    <\/h3>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "                <div class=\"panel-body\">";
oneDashboardTemplate += "                    <table>";
oneDashboardTemplate += "                        <tr ng-repeat=\"log in logs.slice().reverse() track by $index\">";
oneDashboardTemplate += "                            <th>";
oneDashboardTemplate += "                                {{log}}";
oneDashboardTemplate += "                            <\/th>";
oneDashboardTemplate += "                        <\/tr>";
oneDashboardTemplate += "                    <\/table>";
oneDashboardTemplate += "                <\/div>";
oneDashboardTemplate += "            <\/div>";
oneDashboardTemplate += "        <\/div>";
oneDashboardTemplate += "    <\/div>";
oneDashboardTemplate += "<\/div>";
oneDashboardTemplate += "";