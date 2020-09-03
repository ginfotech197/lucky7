
app.config(function($routeProvider){
    $routeProvider.
    when("/",{
        templateUrl : "ng-views-template/welcome.html",
        // controller: "MainController"
    }).when("/terminal",{
        templateUrl : "ng-views-template/terminal.html",
        controller: "terminalController"
    }).when("/admin",{
        templateUrl : "ng-views-template/admin.html",
        controller: "adminController"
    }).when("/stockistPanel",{
        templateUrl : "ng-views-template/stockist_home.html",
        controller: "StockistHomeController"
    }).when("/stockist",{
        templateUrl : "ng-views-template/stockist.html",
        controller: "StockistCtrl"
    }).when("/terminal",{
        templateUrl : "ng-views-template/terminal.html",
        controller: "TerminalCtrl"
    }).when("/stlim",{
        templateUrl : "ng-views-template/stockist_limit.html",
        controller: "StockistLimitCtrl"
    }).when("/trlim",{
        templateUrl : "ng-views-template/terminal_limit.html",
        controller: "TerminalLimitCtrl"
    }).when("/payout",{
        templateUrl : "ng-views-template/payout_setting.html",
        controller: "PayoutSettingCtrl"
    }).when("/manualresult",{
        templateUrl : "ng-views-template/manual_result.html",
        controller: "ManualResultCtrl"
    }).when("/terminalSummaryReport",{
        templateUrl : "ng-views-template/customer_sale_report.html",
        controller: "CustomerSaleReportCtrl"
    }).when("/terminalDateWiseReport",{
        templateUrl : "ng-views-template/barcode_report.html",
        controller: "BarcodeReportCtrl"
    }).when("/drawreport",{
        templateUrl : "ng-views-template/draw_report.html",
        controller: "DrawReportCtrl"
    }).when("/terminalreport",{
        templateUrl : "ng-views-template/report_terminal.html",
        controller: "ReportTerminalCtrl"
    }).when("/result",{
        templateUrl : "ng-views-template/result.html",
        controller: "ResultCtrl"
    }).when("/message",{
        templateUrl : "ng-views-template/message.html",
        controller: "ResultCtrl"
    }).when("/DisplayEvent", {
        templateUrl: "ng-views-template/show_event.html",
        controller: "ShowDisplayController"
    }).when("/addresult", {
        templateUrl: "ng-views-template/emergency_result.html",
        controller: "EmergencyResultCtrl"
    }).when("/helpTerminal", {
        templateUrl: "ng-views-template/help_terminal.html",
        controller: "HelpTerminalCtrl"
    }).otherwise ({
        redirectTo: '/DisplayEvent'
    });
});

