app.controller("BarcodeReportCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
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

    $scope.getTerminalList=function () {
        var request = $http({
            method: "get",
            dataType:JSON,
            url: api_url+"/v1/getAllTerminals",
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

    $scope.selectDate=true;
    $scope.winning_date=$filter('date')(new Date(), 'dd.MM.yyyy');
    $scope.start_date=new Date();
    $scope.end_date=new Date();
    $scope.barcode_report_date=new Date();
    $scope.changeDateFormat=function(userDate){
        return moment(userDate).format('YYYY-MM-DD');
    };

    $scope.isLoading=false;
    $scope.isLoading2=false;

    // get total sale report for 2d game
    $scope.alertMsg2=true;
    $scope.alertMsgCard=true;

    // $scope.$watch("terminalDataWiseReport", function(newValue, oldValue){

    //     if(newValue != oldValue){
    //         var result=alasql('SELECT sum(amount) as total_amount,sum(prize_value) as total_prize_value  from ? ',[newValue]);
    //         $scope.terminalDataWiseReport=result[0];
    //     }
    // });


    $scope.gameList = [
        {id : 1, name : "2D"}
    ];
    $scope.select_game=$scope.gameList[0];

        // get two digit draw time list
        $scope.getDrawList=function (gameNo) {
            if(gameNo==1){
                var request = $http({
                    method: "get",
                    dataType:JSON,
                    url: api_url+"/v1/getAllDrawTimes",
                    data: {}
                    ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function(response){
                    $scope.drawTime=response.data;
                });
            }
        };
        $scope.getDrawList($scope.select_game.id);
        $scope.select_draw_time=0;

        $scope.barcodeType = [
            {id : 1, type : "All barcode"},
            {id : 2, type : "Winning barcode"}
        ];
        $scope.select_barcode_type=$scope.barcodeType[0];
        $scope.select_terminal=0;




            // get terminal report order by barcode
    $scope.showbarcodeReport=[];
    $scope.terminalDataWiseReport=[];
    $scope.getTerminalDateWiseReport=function (start_date,end_date) {
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        var stockistId = -1;
        var personCatTd=$scope.users.person_category_id;
        if(personCatTd==4){
            var stockistId = $scope.users.userId;
        }
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/v1/terminalDateWiseReportFromCPanel",
            data: {
                start_date: start_date,
                end_date: end_date
                ,stockistId: stockistId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.terminalDataWiseReport=response.data; 
        });

    };

    $scope.showParticulars=function (target,barcode) {
        $scope.particularsNote = '';
        $scope.target=target;
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/v1/getBarcodeInputDetails",
            data: {
                barcode: barcode
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.particularsDetails=response.data;
            $scope.particularsDetails.forEach(function (val, idx) {
                $scope.particularsNote += val.series_name + ' ' + val.particulars;
            });  
            $scope.terminalDataWiseReport[target].particulars = $scope.particularsNote;            
        });
    };

    $scope.claimedBarcodeForPrize=function (barcodeDetails,game_id) {
        console.log(barcodeDetails);
        var request = $http({
            method: "post",
            dataType:JSON,
            url: api_url+"/v1/claimBarcodeManually",
            data: {
                playMasterId: barcodeDetails.play_master_id
                ,gameId:game_id
                ,prizeValue:barcodeDetails.prize_value
                ,terminalId : barcodeDetails.terminal_id
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.claimReport=response.data;
            var idx = $scope.terminalDataWiseReport.findIndex( record => record.play_master_id === barcodeDetails.play_master_id);
            $scope.terminalDataWiseReport[idx].is_claimed = $scope.claimReport.is_claimed;
            $scope.terminalDataWiseReport[idx].claimed = 'yes';
            if($scope.claimReport.success==1){
                alert("Thanks for the  claim");
                barcodeDetails.is_claimed=1;
            }
        });
    };
});

