app.controller("DrawReportCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is Barcode controller";
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

    $scope.start_date=new Date();

    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.isLoading=false;
    $scope.isLoading2=true;

    $scope.getMrp=function(){
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/v1/getPlaySeries",
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.gameList = response.data
            $scope.select_game = $scope.gameList[0].series_name;
            $scope.mrpRecord=response.data[0];
        });
    };
    $scope.getMrp();

    // get total sale report for 2d game
    $scope.alertMsg=true;
    $scope.saleReport = [];
    $scope.getDrawWiseSaleReport=function (start_date,select_game) {
        $scope.isLoading=true;
        $scope.alertMsg=false;
        var start_date=$scope.changeDateFormat(start_date);

        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/v1/drawWiseReport",
            data: {
                start_date: start_date,
                series_id: select_game
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.saleReport=response.data;
            $scope.saleReportGameWise=alasql("SELECT * from ? where series_name=?",[$scope.saleReport,select_game]);
            $scope.gameMrp=$scope.mrpRecord.mrp;
            $scope.isLoading=false;
            if($scope.saleReport.length==0){
                $scope.alertMsg=true;
            }else{
                $scope.alertMsg=false;
            }

        });
    };
});

