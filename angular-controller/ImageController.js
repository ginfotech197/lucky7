app.controller('ImageController', function($cookies,$scope,$q,md5,$mdDialog,$timeout,toaster,$http,UserService,$q,RegistrationService,ParticipantService,$window,proofService) {

    alert('dasda');
    //checking Login Status
    $scope.isLoggedIn=function(){
      if($cookies.get('isLoggedIn')==0 || parseInt($cookies.get('userCategoryID'))!=4){
          $timeout(function(){
              $window.location.href = '/LPS';
          },1);
      }
    };
    $scope.isLoggedIn();


    $scope.cancelInvalidImage=function(imageObject,currentForm){
        //making form valid
        currentForm.$setPristine(true);
        currentForm.$setUntouched(true);
        currentForm.$invalid = false;


        if(imageObject.picture==null) {
            imageObject.picture = imageObject.picture2;
            imageObject.title=imageObject.title2;
            if(imageObject.fileName==null &&  imageObject.picture==null ){
                imageObject.title="";
            }
        }else{
            imageObject.picture=null;
        }
        imageObject.isUploadAble=false;
    }
    $scope.showOrHideImageuploadStatusBody=true;
    $scope.testClick=function(){
        return $cookies.get('entrantID');
    }


    $scope.entrantImageUpload = function(imageID,imageObject,secId,place) {
        var url = api_url+"/secure/participantsPicture";
        console.log($cookies);
        var config = { headers: {
                "Content-Type": undefined
                ,'authKey':$cookies.get('authToken')
            }
        };

        //$http.defaults.headers.common['myAuthKey']= "";
        var formData = new $window.FormData();
        var f1 = document.getElementById(imageID).files[0];
        var _URL = window.URL || window.webkitURL;
        img = new Image();
        var imgwidth = 0;
        var imgheight = 0;

        img.src = _URL.createObjectURL(f1);
        img.onload = function() {
            imgwidth = img.width;
            imgheight = img.height;
            formData.append("photo", f1);
            formData.append("file_name", "image_" + $cookies.get('entrantID') + "_" + secId + "_" + place + ".jpg");
            formData.append("participant_id", $cookies.get('entrantID'));
            formData.append("image_name", "image_" + $cookies.get('entrantID') + "_" + secId + "_" + place);
            formData.append("title", imageObject.title);
            formData.append("section_id", secId);
            formData.append("image_no", place);
            formData.append("image_size", f1.size);
            formData.append("image_width", imgwidth);
            formData.append("image_height", imgheight);
            formData.append("admin_id", $scope.users.admin_id);


            $http.post(url, formData, config)
                .then(function (response) {
                    if (response.data.success == 1 && response.status == 200) {
                        imageObject.isUploadAble = false;
                        imageObject.fileName = response.data.fileName;
                        imageObject.picture2 = imageObject.picture;
                        $scope.getImageUploadStatus();
                        toaster.pop('success', 'success', 'Picture Uploaded');
                    }
                }).catch(function (response) {
                if (response.status == 401) {
                    $cookies.put('authToken', "");
                    $cookies.put('firstName', "");
                    $cookies.put('lastName', "");
                    $cookies.put('isLoggedIn', 0);
                    $cookies.put('entrantID',0);
                    $scope.forcedLogoutUnauthorisedUser();
                    //$window.location.href = '/LPS';
                }
                if (response.status == 422) {
                    toaster.pop('error', 'Duplicate', response.data.message);
                }
            });
        }
    };

    $scope.setFileDetails = function(element,sectionNumber,imageNumber) {
        //$scope.images[sectionNumber][imageNumber].picture2=$scope.images[sectionNumber][imageNumber].picture;
        $scope.$apply(function($scope) {
            $scope.theFile = element.files[0];
            var titleParts=element.files[0].name.split(".");

            $scope.images[sectionNumber][imageNumber].title2=$scope.images[sectionNumber][imageNumber].title;
            $scope.images[sectionNumber][imageNumber].title=titleParts[0];
            $scope.images[sectionNumber][imageNumber].isUploadAble=true;
        });
    };

    $scope.isPictureLoaded=false;
    $scope.entrantImagesFromDatabase={};
    $scope.getImagesFromDatabase = function() {
        var x=JSON.stringify({participant_id:$cookies.get('entrantID')})
        $scope.imagesFromDatabaseDefer = $q.defer();
        $.ajax({
            type: "POST",
            url: api_url+"/v1/entrantImages",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.imagesFromDatabaseDefer.resolve(response);
            }
        });
        $scope.imagesFromDatabaseDefer.promise.then(function(response){
            $scope.entrantImagesFromDatabase = response.list;

            $timeout(function () {
                angular.forEach($scope.entrantImagesFromDatabase, function (object, key) {
                    $scope.images[object.section_id][object.image_no].fileName=object.image_name;
                    $scope.images[object.section_id][object.image_no].title=object.title;
                });
                $scope.isPictureLoaded=true;
            }, 1000);

        });
    };
    $scope.getImagesFromDatabase();


    $scope.imageUploadStatus={};
    $scope.getImageUploadStatus=function(){
        var x=JSON.stringify({participant_id:$cookies.get('entrantID')})
        $scope.imageStatusDefer = $q.defer();
        $.ajax({
            type: "POST",
            url: api_url+"/v1/entrantImageStatus",
            data: x,
            async:true,
            crossDomain: true,
            contentType: "json",
            headers: {'Content-Type': 'application/json','crossorigin':'anonymous' },
            processData: false,
            success:function(response) {
                $scope.imageStatusDefer.resolve(response);
            }
        });
        $scope.imageStatusDefer.promise.then(function(response){
            $scope.imageUploadStatus = response.list;
            console.log($scope.imageUploadStatus);
        });
    }
    $scope.getImageUploadStatus();


    $scope.deleteImage = function(secID,place) {
        var confirm = $mdDialog.confirm()
            .title('Do you want to delete the picture?')
            .textContent('')
            .ariaLabel('Sukanta Hui')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
        $mdDialog.show(confirm).then(function() {
            var x=JSON.stringify({partcipant_id:$cookies.get('entrantID'),section_id:secID,image_no: place})
            $scope.deleteImagesDefer = $q.defer();
            $.ajax({
                type: "POST",
                url: api_url+"/secure/deleteImage",
                data: x,
                async:true,
                crossDomain: true,
                contentType: "json",
                headers: {'Content-Type': 'application/json'
                    ,'crossorigin':'anonymous'
                    ,'authKey':$cookies.get('authToken')
                },
                processData: false,
                success:function(response) {
                    $scope.deleteImagesDefer.resolve(response);
                }
            });
            $scope.deleteImagesDefer.promise.then(function(response){
                $scope.images[secID][place].fileName=null;
                $scope.images[secID][place].picture=null;
                // $scope.images[secID][place].isUploadAble=false;
                $scope.getImageUploadStatus();
                toaster.pop('delete','Success','Picture successfully deleted');
            });


        }, function() {

        });
    };
});