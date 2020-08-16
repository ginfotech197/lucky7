app.controller('OrderController', function($scope,$q,$rootScope,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,$window,proofService,localStorageService) {

    //*************************** variables and assignments ***************************************
    $scope.essentialDataFetchingCounter=0;
    $scope.allOrderList=[];
    //$scope.currentDate="2020-11-25";

    $scope.defaultOrderDate=$rootScope.getCurrentDate();
    $scope.defaultDeliveryDate=$rootScope.getDateAfterDays(10);
    $scope.generalMessage="";
    $scope.markFadeOut=true;
    $scope.isCustomerAddressVisible=false;

    $scope.isActiveButton=function(flag){
        if(flag){
            return ({
                "color" : "white",
                "background-color" : "green",
            });
        }else{
            return ({
                "color" : "white",
                "background-color" : "#0f0f0f",
            });
        }
    }



    //********************** end of variables and assignments **************************************

    //function for showing a customer's address for a certain time

    $scope.showCustomerAddress = function() {
        $scope.isCustomerAddressVisible=true;
        $timeout(function() {
            $scope.isCustomerAddressVisible=false;
        }, 3000);
    };

    //function for filtering the model numbers based on the  entry in the input field

    $scope.searchTextChange=function(searchText){
        console.log(searchText);
        // $scope.x = $scope.allProductsList.model_number.filter((product) => product.model_number === 'C100')[0];
        $scope.selectedProductList = alasql("select * from ? where model_number like '"+searchText+"%'",[$scope.allProductsList]);
    };



    $scope.isEssentialDataFetched=function(){
        if($scope.essentialDataFetchingCounter==3)
            return true;
        else
            return  false;
    }

    // function for getting all the customers

    $scope.getCustomers = function() {
        $scope.getCustomersDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/"+"10"+"/persons",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {
                'Content-Type': 'application/json','crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getCustomersDefer.resolve(response);
            }
        });
        $scope.getCustomersDefer.promise.then(function(response){
            $scope.customers = response.data;
            $scope.essentialDataFetchingCounter=$scope.essentialDataFetchingCounter+1;
        });
    };
    $scope.customers={};
    $scope.getCustomers();

    //function for getting all the rates


    $scope.getRates = function() {
        $scope.getRatesDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/rates",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getRatesDefer.resolve(response);
            }
        });
        $scope.getRatesDefer.promise.then(function(response){
            $scope.rates = response.list;
        });
    };
    $scope.rates={};
    $scope.getRates();

    //function for getting  all the agents

    $scope.getAgents = function() {
        $scope.getAgentsDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/"+"7"+"/persons",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getAgentsDefer.resolve(response);
            }
        });
        $scope.getAgentsDefer.promise.then(function(response){
            $scope.agents = response.data;
        });
    };
    $scope.agents={};
    $scope.getAgents();

    $scope.getGoldForProduction = function() {
        $scope.getGoldForProductionDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/"+"1"+"/materials",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getGoldForProductionDefer.resolve(response);
            }
        });
        $scope.getGoldForProductionDefer.promise.then(function(response){
            $scope.goldForProduction = response.data;
        });
    };
    $scope.goldForProduction={};
    $scope.getGoldForProduction();


    //function for getting all the products

    $scope.getAllProducts = function() {
        $scope.getAllProductsDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/products",
            //data: {},
            async:true,
            crossDomain: true,
            //contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getAllProductsDefer.resolve(response);
            }
        });
        $scope.getAllProductsDefer.promise.then(function(response){

            $scope.allProductsList = response.list;
            $scope.essentialDataFetchingCounter=$scope.essentialDataFetchingCounter+1;
        });
    };
    $scope.getAllProducts();


    //function for getting all the price codes

    $scope.getAllPriceCodes = function() {
        $scope.getAllPriceCodesDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/getPriceCode",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getAllPriceCodesDefer.resolve(response);
            }
        });
        $scope.getAllPriceCodesDefer.promise.then(function(response){
            $scope.allPriceCodes = response.list;
            $scope.essentialDataFetchingCounter=$scope.essentialDataFetchingCounter+1;
        });
    };
    //calling getAllPriceCodes()
    $scope.getAllPriceCodes();


    //function for getting price_code,p_loss,price for a particular model number

    $scope.checkModelNumber=function(customer_id,model_number){

        var index=$scope.customers.findIndex(x=>x.id==customer_id);
        $scope.orderMaster.customer=$scope.customers[index];




        //$scope.orderDetails.product_name=$scope.allProductsList[index].model_number;
        $scope.rate=alasql("select * FROM ? WHERE customer_category_id = ? and price_code_id=?", [$scope.rates,$scope.orderMaster.customer.customer_category_id,$scope.orderDetails.model.price_code_id])[0];

        $scope.orderDetails.price=$scope.rate.price;
        $scope.orderDetails.pLoss=$scope.rate.p_loss;
        $scope.orderDetails.priceCode=$scope.rate.price_code_name;

    };

    $scope.calculateAmount=function(){
        $scope.orderDetails.amount=parseInt($scope.orderDetails.quantity)*parseInt($scope.rate.price);
    };


    // function for adding an order in order list table

    $scope.addOrderToOrderDetails=function(orderDetails) {

        // var orderDate=item.orderDay+'/'+item.orderMonth+'/'+item.orderYear;
        // var deliveryDate=item.deliveryDay+'/'+item.deliveryMonth+'/'+item.deliveryYear;
        // console.log(orderDate);
        // console.log(deliveryDate);
        var temporderDetails;
        temporderDetails=angular.copy(orderDetails);
        $scope.orderDetails={};
        $scope.orderDetailsForm.$setPristine(true);
        $scope.allOrderList.push(temporderDetails);
        //to store current orderlist to localstorage service
        //if user refresh the page or reload it the data will not be lost
        localStorageService.set('orderDetailsStorage', $scope.allOrderList);
        localStorageService.set('orderMasterStorage', $scope.orderMaster);

    };


    //function for deleting a order  from order list table

    $scope.deleteOrderDetails=function(index){
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete ?')
            .textContent('')
            .ariaLabel('Sukanta Hui')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            $scope.allOrderList.splice(index,1);
            $scope.markFadeOut=false;
            $scope.generalMessage="Item deleted from List";
            $timeout(function() {
                //$scope.generalMessage="";
                $scope.markFadeOut=true;
            }, 3000);

        },
        function() {
        });

    }
    $scope.orderMaster=localStorageService.get('orderMasterStorage') || {};
    $scope.allOrderList=localStorageService.get('orderDetailsStorage') || [] ;


    $scope.clearLocalStorage=function() {
        localStorageService.set('orderDetailsStorage', null);
        localStorageService.set('orderMasterStorage', null);
    }
    $scope.updateApproxGold = function (item) {
        item.amount=parseInt(item.quantity)*item.price;
        localStorageService.set('orderDetailsStorage', $scope.allOrderList);
    }
});