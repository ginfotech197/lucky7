app.controller("TerminalLimitCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is terminalLimit controller";
    $scope.tab = 1;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.selectedTab = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "15px",
        "padding" : "5px"
    };

    $scope.getTerminalList=function () {
        var request = $http({
            method: "get",
            url: api_url+"/v1/getAllTerminals",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalList=response.data;
            var stockistId=$scope.users.userId;
            var personCatTd=$scope.users.person_category_id;
            if(personCatTd==4){
                $scope.terminalList=alasql("SELECT *  from ? where stockist_id=?",[$scope.terminalList,stockistId]);
            }
        });
    };
    $scope.getTerminalList();




    $scope.saveTerminalRechargeData=function (limit) {
        console.log($scope.users);
        var amount=limit.amount;
        var stockist_cur_bal=limit.terminal.stockist_current_balance;
        var recharge_master_id = $scope.users.userId;
        var recharge_master_cat_id = $scope.users.person_category_id;
        if (amount>stockist_cur_bal){
            alert("Sorry! not enough balance");
            return;
        }
        var terminal_id=limit.terminal.terminal_id;
        var stockist_id=limit.terminal.stockist_id;
        var request = $http({
            method: "post",
            url: api_url+"/v1/saveTerminalRechargeData",
            dataType:JSON,
            data: {
                terminal_id: terminal_id
                ,stockist_id: stockist_id
                ,amount : amount
                ,recharge_master_id: recharge_master_id
                ,recharge_master_cat_id : recharge_master_cat_id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalRechargeReport=response.data;
            if($scope.terminalRechargeReport.success==1){
                $scope.submitStatus = true;
                $scope.isUpdateable=true;
                alert("Current Balance is " + $scope.terminalRechargeReport.current_balance);
                $scope.limit.terminal.terminal_current_balance=$scope.terminalRechargeReport.current_balance;
                $scope.limit.terminal.stockist_current_balance=$scope.limit.terminal.stockist_current_balance - amount;
                $scope.limit.amount='';
                $timeout(function() {
                    $scope.submitStatus = false;
                }, 4000);
                $scope.terminalForm.$setPristine();
            }

        });
    };

    $scope.defaultLimit={};
    $scope.limit=angular.copy($scope.defaultLimit);

 
    $scope.resetRechargeDetails=function () {
        $scope.limit=angular.copy($scope.defaultLimit);
        $scope.isUpdateable=false;
        $scope.submitStatus = false;
    };
    
});

