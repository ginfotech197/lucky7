app.controller("StockistLimitCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is StockistLimitCtrl controller";
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

    $scope.saveStockistRechargeData=function (limit) {
        var stockist_id=limit.stockist.id;
        var amount= limit.amount;
        var recharge_master_id = $scope.users.userId;
        var request = $http({
            method: "post",
            url: api_url+"/v1/saveStockistRechargeData",
            dataType:JSON,
            data: {
                stockist_id: stockist_id
                ,amount : amount
                ,recharge_master_id: recharge_master_id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.stockistRechargeReport=response.data;
            if($scope.stockistRechargeReport.success==1){
                $scope.updateableStockistIndex=0;
                $scope.submitStatus = true;
                $scope.isUpdateable=true;
                alert("Current Balance is " + $scope.stockistRechargeReport.current_balance);
                $scope.limit.stockist.current_balance=$scope.stockistRechargeReport.current_balance;
                $scope.limit.amount='';
                $timeout(function() {
                    $scope.submitStatus = false;
                }, 4000);
                $scope.stockistForm.$setPristine();
            }

        });
    };

    $scope.defaultLimit={};
    $scope.limit=angular.copy($scope.defaultLimit);


    var request = $http({
        method: "get",
        url: api_url+"/v1/getAllStockists",
        dataType:JSON,
        data: {}
        ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function(response){
        $scope.stockistList=response.data;
    });



    $scope.resetRechargeDetails=function () {
        $scope.limit=angular.copy($scope.defaultLimit);
        $scope.isUpdateable=false;
        $scope.submitStatus = false;
    };
});

