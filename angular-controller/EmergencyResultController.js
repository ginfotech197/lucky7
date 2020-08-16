app.controller("EmergencyResultCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
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

    $scope.secondTab = {
        "color" : "white",
        "background-color" : "#ff9900",
        "font-size" : "20px",
        "padding" : "5px"
    };

    $scope.thirdTab = {
        "color" : "white",
        "background-color" : "purple",
        "font-size" : "20px",
        "padding" : "5px"
    };

    $scope.showPanel=false;
    $scope.checkUserAuthentication=function(psw){
        if(psw==909090){
            $scope.showPanel=true;
        }else{
            alert("Try again");
        }
    };


    $scope.drawTimeList=function(){
        var request = $http({
            method: "get",
            url: api_url+"/v1/selectMissedOutDrawTime",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.timeList=response.data;
        });
    };

    $scope.drawTimeList();


    $scope.removeItem = function(item, array) {        
        var index = array.indexOf(item);
        console.log(item,index);
        if(index>=0)
          array.splice(index, 1);
      }


    $scope.putEmergencyResult=function (draw_time) {
        var draw_id=draw_time.id;

       if ($window.confirm("Are you sure to give result manually now?")) {
           $scope.confirmed = 1;
       } else {
           $scope.confirmed = 0;
       }
       if($scope.confirmed){

           var request = $http({
               method: "post",
               url: api_url+"/v1/insertMissedOutResult",
               dataType:JSON,
               data: {
                   drawId: draw_id
               }
               ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           }).then(function(response){
               $scope.resultUpdaterecord=response.data;
               if($scope.resultUpdaterecord.success==1){
                $scope.removeItem(draw_time,$scope.timeList);
                   alert('Result added');
                   $scope.emergencyForm.$setPristine();
               }

           });
       }
   };




   $scope.activateCurrentDrawManually=function (draw_time) {
    var draw_id=draw_time.id;

    if ($window.confirm("Do you want to active this draw now?")) {
        $scope.confirmed = 1;
    } else {
        $scope.confirmed = 0;
    }
    if($scope.confirmed){

        var request = $http({
            method: "post",
            url: api_url+"/v1/activateCurrentDrawManually",
            dataType:JSON,
            data: {
                drawId: draw_id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.drawUpdateRecord=response.data;
            if($scope.drawUpdateRecord.success==1){
                alert('Draw Time activated');
                $scope.removeItem(draw_time,$scope.timeList);
                $scope.drawTimeForm.$setPristine();
            }

        });
    }
};



$scope.changeDateFormat=function(userDate){
    return moment(userDate).format('YYYY-MM-DD');
};



});

