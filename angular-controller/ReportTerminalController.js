app.controller("ReportTerminalCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    $scope.msg = "This is Terminal report controller";
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
    $scope.alertMsg=true;
    $scope.alertMsg2=true;
    $scope.alertMsgCard=true;
    $scope.saleReport = [];
    
    $scope.getNetPayableDetailsByDate=function (start_date,end_date) {
        
        $scope.isLoading=true;
        $scope.alertMsg=false;
        $scope.alertMsg2=true;
        $scope.alertMsgCard=false;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        if(start_date > end_date){
            var temp=start_date;
            start_date=end_date;
            end_date=temp;
        }

        var request = $http({
            method: "post",
            url: api_url+"/v1/terminalReportDetails",
            dataType:JSON,
            data: {
                start_date: start_date
                ,end_date: end_date
                ,terminal_id: $scope.users.userId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.saleReport=response.data;
            $scope.isLoading=false;
            if($scope.saleReport.length==0){
                $scope.alertMsg=true;
            }else{
                $scope.alertMsg=false;
            }
        });
    };

    //$scope.getNetPayableDetailsByDate($scope.start_date,$scope.end_date);


    $scope.gameList = [
        {id : 1, name : "2D"},
        {id : 2, name : "Card"}
    ];
    $scope.select_game=$scope.gameList[0];

    // get two digit draw time list
    $scope.getDrawList=function (gameNo) {
        if(gameNo==1){
            var request = $http({
                method: "get",
                url: api_url+"/v1/getAllDrawTimes",
                dataType:JSON,
                data: {}
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.drawTime=response.data;
            });
        }
        if(gameNo==2){
            var request = $http({
                method: "post",
                url: api_url+"/v1/get_card_draw_time",
                data: {}
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.drawTime=response.data.records;
            });
        }
    };
    $scope.getDrawList($scope.select_game.id);
    $scope.select_draw_time=0;


    $scope.barcodeType = [
        {id : 1, type : "All barcode"},
        {id : 2, type : "Winning barcode"}
    ];
    $scope.select_barcode_type=$scope.barcodeType[0].id;


    $scope.saleReportData=[];
    $scope.getSaleReport=function (start_date,end_date) {
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        
        var request = $http({
            method: "post",
            url: api_url+"/v1/getSaleReportByTerminalId",
            dataType:JSON,
            data: {
                terminalId: $scope.users.userId
                ,start_date: start_date
                ,end_date: end_date
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.saleReportData=response.data;
        });

    };

    
    // get terminal report order by barcode
    $scope.pointWiseTotalReport=[];
    $scope.getAllBarcodeDetailsByDate=function (start_date,end_date,draw_id) {
        
        $scope.isLoading2=true;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);
        $scope.draw_id=draw_id;
        
        
        var request = $http({
            method: "post",
            url: api_url+"/v1/getPointWiseBarcodeReport",
            dataType:JSON,
            data: {
                terminalId: $scope.users.userId
                ,startDate: start_date
                ,endDate: end_date
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.pointWiseTotalReport=response.data;
            $scope.isLoading2=false;
            if(draw_id){
                $scope.pointWiseTotalReport=alasql('SELECT *  from ?  where draw_master_id = ?',[$scope.pointWiseTotalReport,draw_id]);
            }
        });

    };

    $scope.closingPoint=0;
    $scope.getTransactionReport=function (start_date,end_date) {
        $scope.closingPoint=0;
        var start_date=$scope.changeDateFormat(start_date);
        var end_date=$scope.changeDateFormat(end_date);        
        
        var request = $http({
            method: "post",
            url: api_url+"/v1/getTransactionReportFromTerminal",
            dataType:JSON,
            data: {
                terminalId: $scope.users.userId
                ,startDate: start_date
                ,endDate: end_date
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.transactionReport=response.data;
            angular.forEach($scope.transactionReport, function (value, key) { 
                if(value.transaction_type=='opening point'){
                    $scope.closingPoint= $scope.closingPoint+value.total;
                }
                if(value.transaction_type=='Ticket sale'){
                    $scope.closingPoint= $scope.closingPoint-value.total;
                }
                if(value.transaction_type=='Winning amount updated'){
                    $scope.closingPoint= $scope.closingPoint+value.total;
                }
                if(value.transaction_type=='Points limit updated'){
                    $scope.closingPoint= $scope.closingPoint+value.total;
                }
                
            }); 
        });

    };


    $scope.$watch("pointWiseTotalReport", function(newValue, oldValue){

        if(newValue != oldValue){
            var result=alasql('SELECT sum(total) as total_amount  from ? ',[newValue]);
            $scope.saleReportFooter=result[0];
        }
    });

   
    $scope.showParticulars=function (target,barcode) {
        $scope.particularsNote = '';
        $scope.target=target;
        var request = $http({
            method: "post",
            url: api_url+"/v1/getBarcodeInputDetails",
            data: {
                barcode: barcode
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.particularsDetails=response.data;
            $scope.particularsDetails.forEach(function (val, idx) {
                $scope.particularsNote += val.particulars;
            });  
            $scope.pointWiseTotalReport[target].particulars = $scope.particularsNote;   
        });
    };

    $scope.claimTicket=function (idx,barcodeNumber,prize) { 
        var request = $http({
            method: "post",
            url: api_url+"/v1/claimPointManually",
            dataType:JSON,
            data: {
                point: prize,
                barcodeNumber: barcodeNumber,
                terminalId: $scope.users.userId
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.pointWiseTotalReport[idx].is_claimed=response.data.claimed;
            $scope.showAlert(this.ev,response.data.message,'');
            $scope.getActiveTerminalBalance($scope.loginDetails.person.id);
        });

    };

});

