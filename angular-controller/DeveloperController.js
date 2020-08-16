app.controller('DeveloperController', function($scope,$q,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,$window,proofService) {

    //getting the list of all users
    $scope.getPerson = function() {
        $scope.getPersonDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/v1/persons",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/x-www-form-urlencoded','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.getPersonDefer.resolve(response);
            }
        });
        $scope.getPersonDefer.promise.then(function(response){
            $scope.allPersons=response.person;
        });
    };
    $scope.getPerson();

    $scope.persons={};

    //updating the users data
    $scope.updateEntrant=function(data){
        var x=JSON.stringify({participant_id:data.id})
        $scope.getPersonForUpdateDefer = $q.defer();
        $.ajax({
            type: "POST",
            url: api_url1+"/v1/getParticipantForUpdate",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/x-www-form-urlencoded','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.getPersonForUpdateDefer.resolve(response);
            }
        });
        $scope.getPersonForUpdateDefer.promise.then(function(response){
            $scope.persons=response.person[0];
        });
        $mdDialog.show ({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            templateUrl: 'md_dialog_template/profile_entrant.html',

            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
            }
        });
    };

    $scope.updateUser=function(tempData){
        var x={};
        x.id=tempData.id;
        x.person_name=tempData.person_name;
        x.mobile1=tempData.mobile1;
        x.mobile2=tempData.mobile2 || '';
        x.person_type_id=tempData.person_type_id;
        $scope.result = RegistrationService.update(x, function (data) {
                if (data.$status == 200) {
                    var index=$scope.allPersons.findIndex(x=>x.id==data.id.id);
                    $scope.allPersons[index].person_name=tempData.person_name;
                    $scope.allPersons[index].mobile1=tempData.mobile1;
                    $scope.allPersons[index].mobile2=tempData.mobile2;
                    $scope.allPersons[index].person_type_id=tempData.person_type_id;
                    toaster.pop('success', 'Success', 'Entrant Successfully Updated');
                    $mdDialog.hide();
                } else if (data.$status == 204) {
                    var errorMessage = '</ul><li>Error adding to Database</li></ul>';
                    toaster.pop('error', 'Registration Error', errorMessage, 5000, 'trustedHtml', null);
                }
            },
            function (response) {
            }
        );
    };

    //function for deleting a user

    $scope.deleteUser=function(tempData){
        var x={};
        x.id=tempData.id;
        $scope.result = RegistrationService.delete(x, function (data) {
                if (data.$status == 200) {
                    toaster.pop('success', 'Success', 'Entrant Successfully Deleted');
                    $mdDialog.hide();
                } else if (data.$status == 204) {
                    var errorMessage = '</ul><li>Error adding to Database</li></ul>';
                    toaster.pop('error', 'Registration Error', errorMessage, 5000, 'trustedHtml', null);
                }
            },
            function (response) {
            }
        );
    };

    //function for saving new user
    $scope.saveUser=function(tempData){
        var x={};
        x.person_name=tempData.people_name;
        x.mobile1=tempData.contact1;
        x.mobile2=tempData.contact2 || '';
        x.person_type_id=tempData.catagory_id;
        x.email=tempData.email;
        x.password=tempData.password;
        $scope.result = RegistrationService.save(x, function (data) {
                if (data.$status == 200) {
                    toaster.pop('success', 'Success', 'Entrant Successfully recorded');
                    $mdDialog.hide();
                } else if (data.$status == 204) {
                    var errorMessage = '</ul><li>Error adding to Database</li></ul>';
                    toaster.pop('error', 'Registration Error', errorMessage, 5000, 'trustedHtml', null);
                }
            },
            function (response) {
            }
        );
    }
 //function for saving a user for test purpose
    $scope.testSave=function(data){
        var x=JSON.stringify({person_name:"Kristen Stewart",mobile1:'9874563214',mobile2:'7896544569',email:'Kst2218@gmail.com',password:md5.createHash('1234'),person_type_id:7})

        $scope.testSaveDefer=$q.defer();
        $.ajax({
            type: "POST",
            url: api_url1+"/test/testSave",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.testSaveDefer.resolve(response);
            }
        });
        $scope.testSaveDefer.promise.then(function(response){
            $scope.result=response.data;
        });
    };
 //function for deleting a user for test purpose
    $scope.testDelete=function(){
        var x=JSON.stringify({id:3})

        $scope.testDeleteDefer=$q.defer();
        $.ajax({
            type: "DELETE",
            url: api_url1+"/test/testDelete",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.testDeleteDefer.resolve(response);
            }
        });
        $scope.testDeleteDefer.promise.then(function(response){
            $scope.result=response.data;
        });
    };

    //function for updating a user for test purpose

    $scope.testUpdate=function(){

        var x=JSON.stringify({id:3,person_name:"Mounita  NM Bhandari",mobile1:'',mobile2:'',person_type_id:6})

        $scope.testUpdateDefer=$q.defer();
        $.ajax({
            type: "PUT",
            url: api_url1+"/test/testUpdate",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json'
                ,'crossorigin':'anonymous'
            },
            processData: false,
            success:function(response) {
                $scope.testUpdateDefer.resolve(response);
            }
        });
        $scope.testUpdateDefer.promise.then(function(response){
            $scope.result=response.data;
        });
    };
    //function for getting users for test purpose
    $scope.testGet = function() {
        $scope.testGetDefer = $q.defer();
        $.ajax({
            type: "GET",
            url: api_url1+"/test/testGet",
            data: {},
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/x-www-form-urlencoded','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.testGetDefer.resolve(response);
            }
        });
        $scope.testGetDefer.promise.then(function(response){
            $scope.allPersons=response.person;
        });
    };



});