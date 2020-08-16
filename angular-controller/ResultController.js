app.controller("ResultCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is result controller";
    $scope.tab = 1;
    $scope.selectedTab = {
        "color" : "white",
        "background-color" : "coral",
        "font-size" : "15px",
        "padding" : "5px"
    };
    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };


    $scope.start_date=new Date();
    $scope.end_date=new Date();
    
    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.getPlaySeriesList=function(){
        var request = $http({
            method: "get",
            url: api_url+"/v1/getPlaySeries",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.seriesList=response.data;
        });
    }; 
    $scope.getPlaySeriesList();
    // get total sale report for 2d game
    $scope.resultData=[];
    
    $scope.getResultListByDate=function(searchDate){
		var dt=$scope.changeDateFormat(searchDate);
        var request = $http({
            method: "post",
            url: api_url+"/v1/getResultByDate",
            dataType:JSON,
            data: {
            	result_date: dt
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.resultData=response.data;
            
        });
    };  

    $scope.message='';
    $scope.submitNewMessage=function(message){
        var request = $http({
            method: "post",
            url: api_url+"/v1/addNewMessage",
            dataType:JSON,
            data: {
                msg: message
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.messageRecord=response.data;
            if($scope.messageRecord.success==1){
            	 $scope.message='';
                $scope.submitStatus=true;
                $timeout(function() {
                    $scope.submitStatus = false;
                }, 5000);
                
            }
        });
       
    };

});

