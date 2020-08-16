app.controller("PayoutSettingCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is PayoutSettingCtrl controller";
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

    $scope.submitGamePayout=function(twoDigitPayOut){
        var tdp=angular.copy(twoDigitPayOut);
        var request = $http({
            method: "post",
            url: api_url+"/v1/setGamePayout",
            dataType:JSON,
            data: {
                twoDigitPayOut: tdp
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.payOutReport=response.data;
            if($scope.payOutReport.success==1){
                $scope.payoutStatus=true;
                $timeout(function() {
                    $scope.payoutStatus = false;
                }, 5000);
            }
        });
    };

    $scope.defaultLimit={};
    $scope.limit=angular.copy($scope.defaultLimit);


    var request = $http({
        method: "get",
        url: api_url+"/v1/getPlaySeries",
        dataType:JSON,
        data: {}
        ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function(response){
        $scope.TwoDigitPayOut=response.data;
    });
});

