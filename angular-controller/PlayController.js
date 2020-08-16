app.controller('PlayController', function($cookies,$scope,$rootScope,$q,md5,$mdDialog,$timeout,toaster,$http,$interval,$q,RegistrationService,ParticipantService,$window,proofService,localStorageService) {
    $scope.msg = "This is play controller";
    $scope.disableSubmitButton=true;
    $scope.showResultDiv=false;
    
    $scope.getAllSeriesName = function(){
        $http({
            method: 'GET',
            url: api_url+"/v1/getPlaySeries",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.allSeriesList = response.data;
        });
    };
    $scope.getAllSeriesName();

    $scope.getLastDrawresult = function(){
        $http({
            method: 'GET',
            url: api_url+"/v1/getPreviousResult",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.winningValue = response.data;
            rollDice($scope.winningValue.dice1,$scope.winningValue.dice2);
            
        });
    };
    $scope.getLastDrawresult();

    $scope.resultBgColor= ['bg-success','bg-info','bg-success','bg-primary','bg-info','bg-success'];

    $scope.getLimitedResults = function(){
        $http({
            method: 'GET',
            url: api_url+"/v1/getLimitedResultsForDisplay",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.resultsInTop = response.data;
        });
    };

    $scope.getLimitedResults();

    $scope.result_date=new Date();
    $scope.getResultListByDate = function(result_date){
        var dt=$scope.changeDateFormat(result_date);
        $http({
            method: 'POST',
            url: api_url+"/v1/getResultsByDate",
            dataType:JSON,
            data: {gameDate: dt},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.resultBydate = response.data;
        });
    };
    $scope.getResultListByDate();


    $scope.counter = '';
    $scope.getNewDraw = function(){
        $http({
            method: 'GET',
            url: api_url+"/v1/getNextDrawNumber",
            dataType:JSON,
            data: {},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response){
            $scope.counter = response.data.next_draw_id;
        });
    };


    $scope.getNewDraw();
    $interval(function () {
        $scope.getNewDraw();  
        console.log($scope.hour,$scope.minute,$scope.second);
        if($scope.hour>=22){
            $scope.disableSubmitButton = true;
        }else{
            $scope.disableSubmitButton = false;
        }

    },5000);

    $scope.audio = new Audio('audio/wuerfelbecher.wav');
    $scope.audio.play();
    $scope.audio.pause();
    $scope.$watch("counter", function() {
        if($scope.counter !== undefined){
            $scope.getCurrentDrawTime();
            $scope.getLastDrawresult();
            $scope.getLimitedResults();
            if($scope.loginDetails.isLoggedIn){
                $scope.getActiveTerminalBalance($scope.loginDetails.person.id);
            }
        }
    }, true);

    $scope.seriesOne = 0;  //up7
    $scope.seriesTwo =0;   //lucky7
    $scope.seriesThree = 0;   //down7 
    $scope.ticketPrice=0.00;    


    $scope.clearInputBox=function(){
        $scope.seriesOne = 0;
        $scope.seriesTwo = 0;
        $scope.seriesThree = 0;
    };

    $scope.sumOfBox = 0;
    $scope.sumOfTicketPurchased = 0;
  
    $scope.getTotalBuyTicket=function(){ 
        var mrp=0;
        var sum=0;  
        if($scope.seriesOne===undefined){
            $scope.seriesOne=0;
        }
        if($scope.seriesTwo===undefined){
            $scope.seriesTwo=0;
        }
        if($scope.seriesThree===undefined){
            $scope.seriesThree=0;
        }
        $scope.sumOfBox = parseInt($scope.seriesOne) + parseInt($scope.seriesTwo) + parseInt($scope.seriesThree);
        if($scope.allSeriesList!==undefined){
            $scope.sumOfTicketPurchased = parseFloat($scope.seriesOne*$scope.allSeriesList[0].mrp)+parseFloat($scope.seriesTwo*$scope.allSeriesList[1].mrp)+parseFloat($scope.seriesThree*$scope.allSeriesList[2].mrp);
        }
        
    };  


    $scope.$watch("seriesOne", function() {
        $scope.getTotalBuyTicket()
    }, true);

    $scope.$watch("seriesTwo", function() {
        $scope.getTotalBuyTicket()
    }, true);

    $scope.$watch("seriesThree", function() {
        $scope.getTotalBuyTicket()
    }, true);

    
    $scope.submitGameValues=function (seriesOne,seriesTwo,seriesThree) {
        var alertTitle = '';
        var alertDescription ='';
        if($scope.leftMinute!==undefined && $scope.leftMinute===0){
            alertTitle = 'Draw closed';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        
        $scope.disableSubmitButton = true;
        var userId = $scope.users.userId;
        if($scope.drawTimeList!== undefined){
            var drawId  = $scope.drawTimeList.id;
        }else{
            $scope.showAlert(this.ev,'Draw time missing','');
            $scope.disableSubmitButton = false;
            return;
        }
        if(!$scope.users.userId){
            alertTitle = 'Please login';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        var masterData=[];

            if(seriesOne>0){
                masterData.push({ "play_series_id": 1, "input_value": seriesOne});
            }
            if(seriesTwo>0){
                masterData.push({ "play_series_id": 2, "input_value": seriesTwo});
            }
            if(seriesThree>0){
                masterData.push({ "play_series_id": 3, "input_value": seriesThree});
            }
        if(masterData.length === 0){
            alertTitle = 'Input is not valid';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        var balance=$scope.loggedInTerminalBalance.current_balance;
        var purchasedTicket=$rootScope.roundNumber($scope.sumOfTicketPurchased,2);
        if(purchasedTicket > balance) {
            alertTitle = 'Sorry account balance is low';
            alertDescription ="";
            $scope.showAlert(this.ev,alertTitle,alertDescription);
            $scope.disableSubmitButton = false;
            return;
        }
        var request = $http({
            method: 'POST',
            url: api_url+"/v1/saveGameInputDetails",
            dataType:JSON,
            data: {
                userId: userId,
                playDetails: masterData
                ,drawId: drawId
                ,purchasedTicket: purchasedTicket
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.reportArray = response.data;
            if($scope.reportArray.success == 1){
                $scope.showAlert(this.ev,"Print done",'');
                $scope.loggedInTerminalBalance.current_balance = $scope.reportArray.current_balance;
                $scope.clearInputBox();
                $scope.sounds.sound.play();
                rollDice($scope.winningValue.dice1,$scope.winningValue.dice2);
                $scope.disableSubmitButton=false;
            }
        });

    };


    $scope.row=14;
    $scope.coloumn=4;
    $scope.getRow = function(num) {
        return new Array(num);
    }
    $scope.getCol = function(num) {
        return new Array(num);
    }
    
});