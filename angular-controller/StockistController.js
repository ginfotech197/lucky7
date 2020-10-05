app.controller("StockistCtrl", function ($scope,$http,$filter,$rootScope,dateFilter,$timeout,$interval,$window) {
    
    try {
        // if(!$scope.loginDetails.isLoggedIn && $scope.loginDetails.person.person_category_id != 1 && $scope.loginDetails.person.person_category_id != 4){        
        //     $window.location.href = base_url;         
        // }


        $scope.msg = "This is stockist controller";
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



        var request = $http({
            method: 'get',
            url: api_url+"/v1/getAllStockists",
            dataType:JSON,
            data: {}
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.stockistList=response.data;
        });
    

        $scope.saveStockistData=function (stockist) {
            var request = $http({
                method: 'POST',
                url: api_url+"/v1/saveNewStockist",
                dataType:JSON,
                data: {
                    stockist: stockist
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.stockistReport=response.data;
                if($scope.stockistReport.success==1){
                    $scope.stockist.id = $scope.stockistReport.stockist_id;
                    $scope.stockist.user_id = $scope.stockistReport.user_id;
                    $scope.updateableStockistIndex=0;
                    $scope.submitStatus = true;
                    $scope.isUpdateable=true;
                    $timeout(function() {
                        $scope.submitStatus = false;
                    }, 4000);
                    $scope.stockistList.unshift($scope.stockist);
                    $scope.stockistForm.$setPristine();
                }

            });
        };

        $scope.defaultStockist={
            stockist_name: ""
            ,user_id: ""
            ,user_password: "",
            commission:0
        };
        $scope.stockist=angular.copy($scope.defaultStockist);
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

                $scope.stockist.user_password=pass;
                return $scope.stockist.user_password;
            }
        }






        $scope.updateStockistFromTable = function(stockist) {
            $scope.tab=1;
            $scope.stockist = angular.copy(stockist);
            $scope.isUpdateable=true;
            var index=$scope.stockistList.indexOf(stockist);
            $scope.updateableStockistIndex=index;
            $scope.stockistForm.$setPristine();
        };

        $scope.updateStockistByStockistId=function(stockist,id){
            $scope.master = angular.copy(stockist);
            $scope.master.id = id;
            var request = $http({
                method: 'POST',
                url: api_url+"/v1/updateStockistDetails",
                dataType:JSON,
                data: {
                    stockist: $scope.master
                }
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.stockistReport=response.data;
                if($scope.stockistReport.success==1){
                    $scope.updateStatus = true;
                    $scope.isUpdateable=true;
                    $timeout(function() {
                        $scope.updateStatus = false;
                    }, 4000);
                    $scope.stockistList[$scope.updateableStockistIndex]=$scope.stockist;
                    $scope.stockistForm.$setPristine();
                }

            });
        };


        $scope.resetStockistDetails=function () {
            $scope.stockist=angular.copy($scope.defaultStockist);
            $scope.isUpdateable=false;
            $scope.getNextUserId();
        };

        $scope.getNextUserId=function () {
            var request = $http({
                method: 'get',
                url: api_url+"/v1/selectNextStockistId",
                dataType:JSON,
                data: {}
                ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function(response){
                $scope.stockist.user_id=response.data;
                $scope.stockist.user_id=$scope.stockist.user_id.replace(/\"/g, "");
            });
        };

        $scope.getNextUserId();
      }
      catch(err) {
        console.log("Error: " + err + ".");
      }

});

