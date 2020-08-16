app.controller('ProductController', function($scope,$q,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,$window,proofService) {

    //function for getting the list of all product categories
    $scope.getProductCategories = function() {
        $scope.getProductCategoriesDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/getProductCategories",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.getProductCategoriesDefer.resolve(response);
            }
        });
        $scope.getProductCategoriesDefer.promise.then(function(response){
            $scope.allProductCategoriesList = response.list;
        });
    };
    //calling method getProductCategories()
    $scope.getProductCategories();


    //function for getting the list of all products

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
        });
    };
    // calling getAllProducts()
    $scope.getAllProducts();


    //function for getting the list of all rates

    $scope.getRates = function() {
        $scope.getRatesDefer = $q.defer();
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
                $scope.getRatesDefer.resolve(response);
            }
        });
        $scope.getRatesDefer.promise.then(function(response){
            $scope.allPriceCodes = response.list;
        });
    };
    //calling getRates()
    $scope.getRates();


    //function for saving product

    $scope.saveProduct=function(tempData){
        //not required here
        // var x=JSON.stringify({model_number:tempData.model_number,product_name:tempData.product_name,product_category_id:tempData.product_category_id,price_code_id:tempData.price_code_id});

        var x=JSON.stringify(tempData);
        $scope.saveProductDefer = $q.defer();
        $.ajax({
            type: "POST",
            url: api_url1+"/v1/products",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.saveProductDefer.resolve(response);
            }
        });
        $scope.saveProductDefer.promise.then(function(response){
            $scope.response=response;
            if(response.Success==1){
                $scope.product={};
                $scope.productForm.$setPristine(true);
                $scope.allProductsList.splice(0,0,response.product);
                toaster.pop('success','Success',' Product Successfully Added');

            }
            else
            {
                $scope.disabledAfterSave=false;
                toaster.pop('Error','Error','Error in adding product!');
            }


        });
    };


    //function for clicking the update button in the product list

    $scope.update=function(item){
       // $scope.updatableItem=item;


       $scope.product = angular.copy(item);

       console.log($scope.product);
       console.log(item);
    }

    $scope.cancel=function(){

        $scope.product={};
        $scope.productForm.$setPristine(true);
    }


    // for updating a product

    $scope.updateProduct=function(item){

        var x=JSON.stringify(item);
        $scope.updateProductDefer = $q.defer();
        $.ajax({
            type: "PUT",
            url: api_url1+"/v1/products/"+item.id,
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.updateProductDefer.resolve(response);
            }
        });
        $scope.updateProductDefer.promise.then(function(response){
            $scope.response=response;
            if(response.Success==1){
                var index=$scope.allProductsList.findIndex(x=>x.id==$scope.product.id);
                $scope.allProductsList[index]=response.product;
                $scope.product=null;
                toaster.pop('update','Success',' Product Successfully Updated');

            }
            else
            {
                $scope.disabledAfterSave=false;
                toaster.pop('Error','Error','Error in updating product!');
            }


        });
    }


    //function for deleting a product
    $scope.deleteProduct=function(item,iteration){
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete ?')
            .textContent('')
            .ariaLabel('Sukanta Hui')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            // var x=JSON.stringify({id:item.id});
            $scope.deleteProductDefer = $q.defer();
            $.ajax({
                type: "DELETE",
                url: api_url1+"/v1/products/"+item.id,
                // data: x,
                async:true,
                crossDomain: true,
                contentType: "json",
                headers: {'Content-Type': 'application/json'
                    ,'crossorigin':'anonymous'
                },
                processData: false,
                success:function(response) {
                    $scope.deleteProductDefer.resolve(response);
                }
            });
            $scope.deleteProductDefer.promise.then(function(response){
                if(response.success==1){
                    toaster.pop('success','Success',' Product Successfully Deleted');
                    $scope.allProductsList.splice(iteration, 1);
                }
            });
        }, function() {
        });

    }

    //for getting product data in Excel
    $scope.getProductExcelData= function () {
        var mystyle = {
            sheetid: 'Products sheet',
            headers: true,
            style: 'font-size:80px',
            caption: {
                title: 'Products Record',
                style: 'font-size: 100px; color:blue;' // Sorry, styles do not works
            },
            // style:'background:#00FF00',
            style: 'background:lightgrey; text-align: center;',
            column: {
                style: 'font-size:20px; color: red'
            },
            columns: [
                {columnid: 'product_name', title: 'Product Name '},
                {columnid: 'model_number', title: 'Model Number'},
                {columnid: 'category_name', title: 'Product Category'},
                {columnid: 'price', title: 'Rate'},
            ],
            rows: {
                //for putting background color in particular row
                0:{
                    cell: {
                        style: 'font-size:17px;background:#115ea2;color:white;font-weight:bold'
                    }
                },
                1:{
                    cell: {
                        style: 'font-size:17px;background:#115ea2;color:white;font-weight:bold'
                    }
                },
                2: {
                    cell: {
                        style: 'font-size:17px;background:#115ea2;color:white;font-weight:bold'
                    }
                },
                3:{
                    cell: {
                        style: 'font-size:17px;background:#115ea2;color:white;font-weight:bold'
                    }
                },
            },
            cells:{
                //if you want to put style in particular cell
                1:{
                    5:{
                        style: 'font-size:20px;background:#115ea2 ;color:white;font-weight:bold;text-align:right',
                        value: function(value){return value;}
                    },
                }
            }
        };

        $scope.exportData = function () {
            alasql('SELECT * INTO XLS("Products.xls",?) FROM ?',[mystyle,$scope.allProductsList]);
        };
        $scope.exportData();
    };

});