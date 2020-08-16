app.controller("ManualResultCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is ManualResultCtrl controller";
    $scope.tab = 1;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.manualResultObj = {};
    $scope.manualResultTime = {};

    $scope.x = false;   /*  This variable set for editable manual form  */

   $scope.gameList=[{game_id: 1,game_name: "2 DIGIT"}];


    $scope.getPlaySeries=function () {
        var request = $http({
            method: "get",
            url: api_url+"/v1/getPlaySeries",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.seriesList=response.data;  
            $scope.manualResultObj= $scope.seriesList[0];        
        });
    };
    $scope.getPlaySeries();

    $scope.totalSaleByDraw = [];
    $scope.getTotalSaleDataByDraw=function(manualResultTime){
        var master={};
        if(manualResultTime!==undefined){
            master.draw_master_id=parseInt(manualResultTime.id);
        }       
        var request = $http({
            method: "post",
            url: api_url+"/v1/getTotalSalePerDraw",
            dataType:JSON,
            data: {
                master: master
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.totalSaleByDraw=response.data;
        });
       
    };


    $scope.getDigitDrawTime=function () {
        var request = $http({
            method: "get",
            url: api_url+"/v1/getDrawTimeForManualResult",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.digitDrawTime=response.data;
            // $scope.manualResultTime=$scope.digitDrawTime[0];
            // $scope.getTotalSaleDataByDraw($scope.manualResultTime);
        });
    };
    $scope.getDigitDrawTime();


    $scope.series_one_val='';$scope.series_two_val='';$scope.series_three_val=''
    $scope.getEditableManual=function () {
        var request = $http({
            method: "get",
            url: api_url+"/v1/getLastInsertedManualResult",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.editableResult=response.data;  

            $scope.editableResult.forEach(function (val, idx) {
                if (val.play_series_id == 1) {
                    $scope.series_one_val=val.result;
                }
                if (val.play_series_id == 2) {
                    $scope.series_two_val=val.result;
                }
                if (val.play_series_id == 3) {
                    $scope.series_three_val=val.result;
                }
            });      
        });
    };



    $scope.submitManualResult=function(manualResultObj,manualResultTime){
        console.log(manualResultTime);
        var alertTitle = '';
        var alertDescription ='';
        var master={};
        if(manualResultObj!==undefined){
            master.result_series_id=parseInt(manualResultObj.id);
        }else{
            alertTitle = 'Result not set';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
        }
        if(manualResultTime!==undefined){
            master.draw_master_id=parseInt(manualResultTime.id);
        }else{
            alertTitle = 'Draw time not selected';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
        }
        if( master.draw_master_id=== undefined || master.result_series_id=== undefined){
            alert('input not valid');
            return;
        }
        var request = $http({
            method: "post",
            url: api_url+"/v1/saveManualResult",
            dataType:JSON,
            data: {
                master: master
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.manualResultReport=response.data;
            console.log($scope.manualResultReport);
            if($scope.manualResultReport.success==1){
                $scope.manualData={}; 
                var alertTitle = 'Result added manually';
                var alertDescription ="";
                $scope.showAlert(this.ev,alertTitle,alertDescription);
                $scope.getDigitDrawTime();
                
            }else{
                alert("Something went wrong");
            }
        });
       
    };



    // $scope.color = {
    //     name: 'blue'
    //   };
    $scope.payoutValue ='low';

    $scope.getGamePayout=function(){
        var request = $http({
            method: "get",
            url: api_url+"/v1/getGamePayout",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.record=response.data;
            if($scope.record!=null){
                $scope.payoutValue=$scope.record.payout_status;
            }else{
                $scope.payoutValue ='low';
            }
        });
    };
    $scope.getGamePayout();

    $scope.submitGamePayout=function(payoutValue){
        var request = $http({
            method: "post",
            url: api_url+"/v1/setGamePayout",
            dataType:JSON,
            data: {
                payoutValue: payoutValue
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.payOutReport=response.data;
            if($scope.payOutReport.success==1){
                var alertTitle = 'Payout updated';
                var alertDescription ="";
                $scope.showAlert(this.ev,alertTitle,alertDescription);
            }
        });
    };

});

