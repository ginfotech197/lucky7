app.controller('WorkerController', function($scope,$q,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,$window,proofService) {

    // $scope.getProductCategories = function() {
    //     $scope.getProductCategoriesDefer = $q.defer();
    //     $.ajax({
    //         type: "GET",
    //         url: api_url1+"/v1/getProductCategories",
    //         data: {},
    //         async:true,
    //         crossDomain: true,
    //         contentType: "json",
    //         headers: {'Content-Type': 'application/json'
    //             ,'crossorigin':'anonymous'
    //         },
    //         processData: false,
    //         success:function(response) {
    //             $scope.getProductCategoriesDefer.resolve(response);
    //         }
    //     });
    //     $scope.getProductCategoriesDefer.promise.then(function(response){
    //         $scope.allProductCategoriesList = response.list;
    //     });
    // };
    // $scope.getProductCategories();
    //
    // $scope.getAllProducts = function() {
    //     $scope.getAllProductsDefer = $q.defer();
    //     $.ajax({
    //         type: "GET",
    //         url: api_url1+"/v1/getAllProducts",
    //         data: {},
    //         async:true,
    //         crossDomain: true,
    //         contentType: "json",
    //         headers: {'Content-Type': 'application/json'
    //             ,'crossorigin':'anonymous'
    //         },
    //         processData: false,
    //         success:function(response) {
    //             $scope.getAllProductsDefer.resolve(response);
    //         }
    //     });
    //     $scope.getAllProductsDefer.promise.then(function(response){
    //         $scope.allProductsList = response.list;
    //     });
    // };
    // $scope.getAllProducts();
    //
    // $scope.getRates = function() {
    //     $scope.getRatesDefer = $q.defer();
    //     $.ajax({
    //         type: "GET",
    //         url: api_url1+"/v1/getRate",
    //         data: {},
    //         async:true,
    //         crossDomain: true,
    //         contentType: "json",
    //         headers: {'Content-Type': 'application/json'
    //             ,'crossorigin':'anonymous'
    //         },
    //         processData: false,
    //         success:function(response) {
    //             $scope.getRatesDefer.resolve(response);
    //         }
    //     });
    //     $scope.getRatesDefer.promise.then(function(response){
    //         $scope.allRates = response.list;
    //     });
    // };
    // $scope.getRates();
    //
    // $scope.disabledAfterSave=false;
    // $scope.saveProduct=function(tempData){
    //     var x=JSON.stringify({model_number:tempData.model_number,product_name:tempData.product_name,product_category_id:tempData.product_category_id,rate_id:tempData.rate_id});
    //     $scope.saveProductDefer = $q.defer();
    //     $.ajax({
    //         type: "POST",
    //         url: api_url1+"/v1/saveProducts",
    //         data: x,
    //         async:true,
    //         crossDomain: true,
    //         contentType: "json",
    //         headers: {'Content-Type': 'application/json'
    //             ,'crossorigin':'anonymous'
    //         },
    //         processData: false,
    //         success:function(response) {
    //             $scope.saveProductDefer.resolve(response);
    //         }
    //     });
    //     $scope.saveProductDefer.promise.then(function(response){
    //         $scope.response=response;
    //         if(response.Success==1){
    //             $scope.product={};
    //             $scope.productForm.$setPristine(true);
    //             $scope.allProductsList.splice(0,0,response.product);
    //             toaster.pop('success','Success',' Product Successfully Added');
    //
    //         }
    //         else
    //         {
    //             $scope.disabledAfterSave=false;
    //             toaster.pop('Error','Error','Error in adding product!');
    //         }
    //
    //
    //     });
    // };
    //
    // $scope.updateProduct=function(item){
    //      $scope.product=item;
    // }
    //
    // $scope.deleteProduct=function(item,iteration){
    //     var confirm = $mdDialog.confirm()
    //         .title('Are you sure to delete ?')
    //         .textContent('')
    //         .ariaLabel('Sukanta Hui')
    //         .targetEvent(event)
    //         .ok('Yes')
    //         .cancel('No');
    //     $mdDialog.show(confirm).then(function() {
    //         var x=JSON.stringify({id:item.id});
    //         $scope.deleteProductDefer = $q.defer();
    //         $.ajax({
    //             type: "DELETE",
    //             url: api_url1+"/v1/deleteProduct",
    //             data: x,
    //             async:true,
    //             crossDomain: true,
    //             contentType: "json",
    //             headers: {'Content-Type': 'application/json'
    //                 ,'crossorigin':'anonymous'
    //             },
    //             processData: false,
    //             success:function(response) {
    //                 $scope.deleteProductDefer.resolve(response);
    //             }
    //         });
    //         $scope.deleteProductDefer.promise.then(function(response){
    //             if(response.success==1){
    //                 toaster.pop('success','Success',' Product Successfully Deleted');
    //                 $scope.allProductsList.splice(iteration, 1);
    //             }
    //         });
    //     }, function() {
    //     });
    //
    // }

});