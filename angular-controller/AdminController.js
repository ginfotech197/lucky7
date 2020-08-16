app.controller('adminController', function($cookies,$scope,$q,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,ParticipantService,$window,proofService,localStorageService) {

    $scope.resetData={};
    $scope.resetPassword=function(resetData){
        var request = $http({
            method: "post",
            url: api_url+"/v1/resetAdminPassword",
            dataType:JSON,
            data: {
                userId: $scope.users.userId,
                psw: resetData.user_password
            }
            ,headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(response){
            $scope.resetRecord=response.data;
            if($scope.resetRecord.success==1){
                $scope.unsetUserData();
                $(".modal-backdrop").hide();
                $('#reset-modal').modal('hide');
                $scope.popSuccess('Password reset successfully','');
            }else{

            }
        });
       
    };
});