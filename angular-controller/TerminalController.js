app.controller("TerminalCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    
    try {
        // if(!$scope.loginDetails.isLoggedIn && $scope.loginDetails.person.person_category_id != 1 && $scope.loginDetails.person.person_category_id != 4){        
        //     $window.location.href = base_url;         
        // }


        $scope.msg = "This is terminal controller";
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


        
        // get all terminal list

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
                $scope.terminalList=alasql("SELECT *  from ? where cast(stockist_id as number)=?",[$scope.terminalList,stockistId]);
            }
        });




        $scope.saveTerminalData=function (terminal) {
            var master=angular.copy(terminal);
            if(terminal.commission>terminal.stockist.commission){
                alertTitle = "More than stockist's commission not allowed";
                alertDescription ="";
                $scope.showAlert(this.ev,alertTitle,alertDescription);
            }
            master.stockist=terminal.stockist.id;
            var stockist_sl_no= terminal.stockist.serial_number;
            var stockist_id= terminal.stockist.id;
            var request = $http({
                method: "post",
                url: api_url+"/v1/saveNewTerminal",
                dataType:JSON,
                data: {
                    terminal: master
                    ,stockist_sl_no: stockist_sl_no
                    ,stockist_id: stockist_id
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.terminalReport=response.data;
                if($scope.terminalReport.success==1){
                    $scope.updateableTerminalIndex=0;
                    $scope.submitStatus = true;
                    $scope.isUpdateable=true;
                    $timeout(function() {
                        $scope.submitStatus = false;
                    }, 4000);

                    $scope.terminal.terminal_id = $scope.terminalReport.terminal_id;
                    var tempTerminal={};
                    tempTerminal.terminal_id=$scope.terminalReport.terminal_id;
                    tempTerminal.stockist_id=$scope.terminal.stockist.id;
                    tempTerminal.stockist_name=$scope.terminal.stockist.stockist_name;
                    tempTerminal.people_name=$scope.terminal.people_name;
                    tempTerminal.user_id=$scope.terminal.user_id;
                    tempTerminal.user_password=$scope.terminal.user_password;
                    tempTerminal.default_password=$scope.terminal.user_password;
                    tempTerminal.terminal_commission=$scope.terminal.commission;
                    tempTerminal.stockist_commission=terminal.stockist.commission;
                    $scope.terminalList.unshift(tempTerminal);
                    $scope.terminalForm.$setPristine();
                }

            });
        };

        $scope.defaultTerminal={
            person_name: ""
            ,user_id: ""
            ,user_password: "12345"
            ,default_password: ""
            ,commission:0
        };
        $scope.terminal=$scope.defaultTerminal;
        $scope.randomPass=function(length, addUpper, addSymbols, addNums) {
            var lower = "abcdefghijklmnopqrstuvwxyz";
            var upper = addUpper ? lower.toUpperCase() : "";
            var nums = addNums ? "0123456789" : "";
            var symbols = addSymbols ? "!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~" : "";

            var all = lower + upper + nums + symbols;
            while (true) {
                var pass = "";
                for (var i=0; i<length; i++) {
                    pass += all[Math.random() * all.length | 0];
                }

                // criteria:
                if (!/[a-z]/.test(pass)) continue; // lowercase is a must
                if (addUpper && !/[A-Z]/.test(pass)) continue; // check uppercase
                if (addSymbols && !/\W/.test(pass)) continue; // check symbols
                if (addNums && !/\d/.test(pass)) continue; // check nums

                $scope.terminal.user_password=pass;
                return $scope.terminal.user_password;
            }
        }

        $scope.getInforcedStockist=function(){
            var request = $http({
                method: "get",
                url: api_url+"/v1/getAllStockists",
                dataType:JSON,
                data: {}
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.stockistList=response.data;
                if($scope.stockistList.length!=0){
                    $scope.terminal.stockist = $scope.stockistList[0];
                    $scope.getNextUserId($scope.terminal.stockist.serial_number,$scope.terminal.stockist.id);
                }
                var stockistId=$scope.users.userLoginid;
                var personCatTd=$scope.users.person_category_id;
                if(personCatTd==4){
                    $scope.stockistList=alasql("SELECT *  from ? where user_id=?",[$scope.stockistList,stockistId]);
                }
            });
        };
        $scope.getInforcedStockist();


        $scope.updateTerminalFromTable = function(terminal) {
            $scope.tab=1;
            $scope.terminal = angular.copy(terminal);
            $scope.isUpdateable=true;
            var index=$scope.terminalList.indexOf(terminal);
            $scope.updateableTerminalIndex=index;
            var stockistIndex=$scope.findObjectByKey($scope.stockistList,'id',parseInt(terminal.stockist_id));
            $scope.terminal.stockist=stockistIndex;
            $scope.terminal.commission=terminal.terminal_commission;
            terminal.stockist_commission=terminal.stockist.commission;
            $scope.terminalForm.$setPristine();
        };

        $scope.updateTerminalByTerminalId=function(terminal){
            var master = terminal;
            var request = $http({
                method: "post",
                url: api_url+"/v1/updateTerminalDetails",
                dataType:JSON,
                data: {
                    terminal: master
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.terminalReport=response.data;
                if($scope.terminalReport.success==1){
                    $scope.updateStatus = true;
                    $scope.isUpdateable=true;
                    $timeout(function() {
                        $scope.updateStatus = false;
                    }, 4000);
                    $scope.terminalList[$scope.updateableTerminalIndex]=$scope.terminal;
                    $scope.terminalList[$scope.updateableTerminalIndex].default_password=$scope.terminal.user_password;
                    $scope.terminalList[$scope.updateableTerminalIndex].terminal_commission=$scope.terminal.commission;
                    $scope.terminalForm.$setPristine();
                }

            });
        };


        $scope.resetTerminalDetails=function () {
            var tempStockist = $scope.terminal.stockist;
            $scope.terminal=$scope.defaultTerminal;
            $scope.terminal.stockist = tempStockist;
            $scope.getNextUserId($scope.terminal.stockist.serial_number,$scope.terminal.stockist.id);
            $scope.isUpdateable=false;
        };

        $scope.getNextUserId=function (serialNo,stockistId) {
            var request = $http({
                method: "post",
                url: api_url+"/v1/selectNextTerminalId",
                dataType:JSON,
                data: {
                    serialNo: serialNo
                    ,stockistId: stockistId
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.terminal.user_id=response.data;
            });
        };
      }
      catch(err) {
        console.log("Error: " + err + ".");
      }
    
});

