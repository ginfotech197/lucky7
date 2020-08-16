var authKey="";
var app = angular.module('myApp', ["ngRoute","angular-md5","ngCookies","xeditable","ngMessages","ngResource","ngMaterial","toaster","chart.js","angular-barcode","monospaced.qrcode","ngImageInputWithPreview","720kb.datepicker","smart-table","LocalStorageModule","satellizer"]);




var current_url=window.location.href;
var urlArray=current_url.split("/");
api_url1=urlArray[0]+"//"+urlArray[2]+"/"+"photography_api"+"/"+"public/api";
api_url=urlArray[0]+"//"+urlArray[2]+"/"+"lucky7_api"+"/"+"public/api";

//FOR SERVER
//var base_url=urlArray[0]+'/'+urlArray[1]+'/'+urlArray[2]+'/';

// For local environment
var base_url=urlArray[0]+'/'+urlArray[1]+'/'+urlArray[2]+'/'+urlArray[3]+'/';
entrant_image_url=urlArray[0]+"//"+urlArray[2]+"/"+"photography_api"+"/"+"public/entrant_pictures";

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}])


//local storage configuration
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('luckyseven');
});


//to get current date
app.run(function($http, $rootScope) {

    //this function returs current date
    $rootScope.getCurrentDate = function() {
        var d=new Date();
        var year=d.getFullYear();
        var month=d.getMonth()+1;

        if (month<10){
            month="0" + month;
        }

        var day=d.getDate();

        if(day<10){
            day="0" + day;
        }

        var currentDate=year + "-" + month + "-" + day;
        return currentDate;
    }
    $rootScope.getDateAfterDays = function(addDays) {
        var d=new Date();
        var year=d.getFullYear();
        var month=d.getMonth()+1;

        if (month<10){
            month="0" + month;
        }

        var day=d.getDate();
        day=day+addDays;
        if(day<10){
            day="0" + day;
        }

        var currentDate=year + "-" + month + "-" + day;
        return currentDate;
    }

});



app.run(function(editableOptions) {
    editableOptions.theme = 'bs4'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.directive('stRatio',function(){
    return {
        link:function(scope, element, attr){
            var ratio=+(attr.stRatio);

            element.css('width',ratio+'%');

        }
    };
});

app.directive('hideZero', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$formatters.push(function (inputValue) {
                if (inputValue == 0) {
                    return '';
                }
                return inputValue;
            });
            ngModel.$parsers.push(function (inputValue) {
                if (inputValue == 0) {
                    ngModel.$setViewValue('');
                    ngModel.$render();
                }
                return inputValue;
            });
        }
    };
});

/******** MD Dialogue ***********/
//$mdDialog theme configuration




app.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light

        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('blackAndWhite').primaryPalette('amazingPaletteName');

    //$mdThemingProvider.theme('default').dark();
    $mdThemingProvider.theme('altTheme').dark();
    //$mdThemingProvider.theme('altTheme').primaryPalette('purple');
});


/******** End of MD Dialogue ***********/





// ************* Directives ****************************************************
//This directive prevent anchor to restrict from page link when href is #
app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
    };
});

//this directive will convert a input to capitalize
app.directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    // see where the cursor is before the update so that we can set it back
                    var selection = element[0].selectionStart;
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                    // set back the cursor after rendering
                    element[0].selectionStart = selection;
                    element[0].selectionEnd = selection;
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]); // capitalize initial value
        }
    };
});

//this directive will restrict you from entering data morethan the limit. <input limit-to="4">
app.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit){
                    e.preventDefault();
                }
            });
        }
    }
}]);

//it will allow integer values only <input numbers-only>
app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9-]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

//it will
app.directive('ngConfirmClick', [
    function(){
        return {
            priority: -1,
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('click', function(e){
                    var message = attrs.ngConfirmClick;
                    // confirm() requires jQuery
                    if(message && !confirm(message)){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                });
            }
        }
    }
]);




// ************* End of Directives ****************************************************

//************************ Service**********************************************
app.factory('proofService', function ($resource) {
    var link=api_url+"/participantsDoc";
    var data = $resource(link, {}, {
        update:{
            method:'PUT'
        },
        delete: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return data;
});





app.controller("AddEventController", function($scope,$http,$rootScope,$cookies) {


    $scope.uploadFile=function(){
        alert("asdfas");
        var file = $scope.editItem._attachments_uri.image;
        //var uploadUrl = '127.0.0.1/institution/public/api/test/pics';

        $http({
            url: 'http://127.0.0.1/institution/public/api/test/pics',
            method: "POST",
            data: { 'photo' : file }
        }).then(function(response) {
                    // success
        },
        function(response) { // optional
                    // failed
        });
    }

    $scope.message = "This is to Add a new Event";
    $scope.SetCookies = function () {
        $cookies.put("username", "sukanta");
    };

    $scope.GetCookies = function () {
        $scope.userName=$cookies.get('username');
    };
    $scope.ClearCookies = function () {
        $cookies.remove('username');
    };
    $scope.getToken = function () {
        $scope.token=$cookies.get('token');
    };
    $scope.logOut = function () {
        $cookies.remove('token');
        $scope.token="no token";
        var x=$cookies.getAll();
        console.log(x);
    };
});
app.controller("ShowDisplayController",function($scope,$rootScope,$cookies){
    $scope.message = "This is display an Event";
    $scope.value = $rootScope.test;

    $scope.SetCookies = function () {
        $cookies.put("username", "Sreeparna");
    };

    $scope.GetCookies = function () {
        $scope.userName=$cookies.get('username');
        console.log("child controller");
        var x=$cookies.getAll();
    };
    $scope.ClearCookies = function () {
        $cookies.remove('username');
    };
    $scope.getToken = function () {
        $scope.token=$cookies.get('token');
    };
    $scope.logOut = function () {
        $cookies.remove('token');
        $scope.token="no token";
        var x=$cookies.getAll();
        console.log(x);
    };
});

app.controller("ExampleController", function($scope,$rootScope,$cookies) {
    /*ALASQL to excel*/
    var mystyle = {
        sheetid: 'My Big Table Sheet',
        headers: true,
        caption: {
            title:'My Big Table',
            style:'font-size: 50px; color:blue;' // Sorry, styles do not works
        },
        style:'background:#00FF00',
        column: {
            style:'font-size:30px'
        },
        columns: [
            {columnid:'email'},
            {columnid:'dob', title: 'Birthday', width:300},
            {columnid:'name'},
            {
                columnid:'name',
                title: 'Number of letters in name',
                width: '300px',
                cell: {
                    value: function(value){return value.length}
                }
            },
        ],
        row: {
            style: function(sheet,row,rowidx){
                return 'background:'+(rowidx%2?'red':'yellow');
            }
        },
        rows: {
            4:{cell:{style:'background:blue'}}
        },
        cells: {
            2:{
                2:{
                    style: 'font-size:45px;background:pink',
                    value: function(value){return value.substr(1,3);}
                }
            }
        }
    };



    $scope.exportData = function () {
        alasql('SELECT * INTO XLS("Mohit_Vashishtha.xls",?) FROM ?',[mystyle,$scope.items]);
    };

    $scope.items = [{
        name: "Mohit Vashishtha",
        email: "mv@example.com",
        dob: "1985-10-10"
    }, {
        name: "Mohit Sharma",
        email: "ms@example.com",
        dob: "1988-12-22"
    }, {
        name: "Kapil dev",
        email: "kd@example.com",
        dob: "2010-01-02"
    }, {
        name: "Sachin tendulkar",
        email: "st@exmaple.com",
        dob: "2009-03-21"
    }, {
        name: "Rani mukharji",
        email: "rani@example.com",
        dob: "2011-12-12"
    }, {
        name: "Twinkal khanna",
        email: "tk@example.com",
        dob: "2011-12-12"
    }, {
        name: "Anil kapoor",
        email: "ak@example.com",
        dob: "2011-12-12"
    }, {
        name: "Rishi kapoor",
        email: "rk@example.com",
        dob: "2011-12-12"
    }, {
        name: "Arjun Rampal",
        email: "ar@example.com",
        dob: "2011-12-12"
    }, {
        name: "Salman Khan",
        email: "sk@example.com",
        dob: "2011-12-12"
    }, {
        name: "Amir khan",
        email: "ak@example.com",
        dob: "2011-12-12"
    }, {
        name: "Ritesh deshmukh",
        email: "rd@example.com",
        dob: "2004-10-12"
    }];

    $scope.exportExcel= function () {
        alasql('SELECT * INTO XLSX("myinquires.xlsx",{headers:true}) \
                    FROM HTML("#MyInquires",{headers:true})');
    }


    /*End ALASQL to excel*/

    $scope.message = "This is Example Contoller";
    //for barcode
    $scope.txt="345345345";
    $scope.bc = {
        format: 'CODE128',
        lineColor: '#000000',
        width: 2,
        height: 100,
        displayValue: true,
        fontOptions: '',
        font: 'monospace',
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        fontSize: 20,
        background: '#ffffff',
        margin: 0,
        marginTop: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
        marginRight: undefined,
        valid: function (valid) {
        }
    }



    if ( angular.element('#barcode').length ) {
        JsBarcode("#barcode", "Hi!");
    }
    if ( angular.element('#barcode1').length ) {
        JsBarcode("#barcode1")
            .options({font: "OCR-B"}) // Will affect all barcodes
            .EAN13("1234567890128", {fontSize: 18, textMargin: 0})
            .blank(20) // Create space between the barcodes
            .EAN5("12345", {height: 85, textPosition: "top", fontSize: 16, marginTop: 15})
            .render();
    }
    if ( angular.element('#barcode2').length ) {
        JsBarcode("#barcode2", "123456789012", {
            format: "CODE39",
            height:25
        });
    }


    $scope.SetCookies = function () {
        $cookies.put("username", "sukanta");
    };
    $scope.GetCookies = function () {
        $scope.userName=$cookies.get('username');
        console.log($scope.userName);
    };
    $scope.ClearCookies = function () {
        $cookies.remove('username');
    };
    $scope.getToken = function () {
        $scope.token=$cookies.get('token');
    };
    $scope.logOut = function () {
        $cookies.remove('token');
        $scope.token="no token";
        var x=$cookies.getAll();
        console.log(x);
    };
});


app.controller("exampleFileUpload", function($scope, $http, $window) {
    var _URL = window.URL || window.webkitURL;
    $(".file-select").change(function(e) {
        var fileSize=this.files[0].size/(1024*1024);
        if(this.files[0].size >= 1048576){
            console.log(this.files[0].size);
            alert("File should be less than 1 MB !, current size is: "+Math.round(fileSize,2)+" MB");
            this.value = "";
            return;
        };

        var image, file;
        if ((file = this.files[0])) {
            image = new Image();
            image.onload = function() {
                $scope.currentImageWidth=image.width;
                $scope.currentImageHeight=image.height;
                if(this.width>100 || this.height>980){
                    alert("Height or width is not within the reange");
                    return;
                }

            };
            image.src = _URL.createObjectURL(file);
        }

    });






    var url = "http://127.0.0.1/institution/public/api/test/pics";
    var config = { headers: {
            "Content-Type": undefined,
            //"Content-Type": 'multipart',
        }
    };


    $scope.add = function(imageID) {
        var formData = new $window.FormData();
        var f1 = document.getElementById(imageID).files[0];
        formData.append("photo", f1);
        $http.post(url, formData, config).
        then(function(response) {
            $scope.result = "SUCCESS";
        }).catch(function(response) {
            $scope.result = "ERROR "+response.status;
        });
    }

    $scope.add2 = function(imageID) {
        var formData = new $window.FormData();
        var f1 = imageID;
        formData.append("photo", f1);
        $http.post(url, formData, config).
        then(function(response) {
            $scope.result = "SUCCESS";
        }).catch(function(response) {
            $scope.result = "ERROR "+response.status;
        });
    }







    var vm = $scope;
    vm.upload = function() {

        var formData = new $window.FormData();

        formData.append("photo", $scope.files[0]);
        $http.post(url, formData, config).
        then(function(response) {
            vm.result = "SUCCESS";
        }).catch(function(response) {
            vm.result = "ERROR "+response.status;
        });
    };

    /*Upload 2*/
    $scope.uploadFileSecond = function(files) {
        console.log(files);

        var fd = new FormData();
        //Take the first selected file
        fd.append("photo", files[0]);

        $http.post("http://127.0.0.1/institution/public/api/test/pics", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then().error();

    };


    $scope.imageSrc = "";

    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });
});




app.directive("ngFileSelect", function(fileReader, $timeout) {
    return {
        scope: {
            ngModel: '='
        },
        link: function($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function(result) {
                        $timeout(function() {
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function(e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});

app.factory("fileReader", function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function(event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function(file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };









});

app.directive("myFiles", function($parse) {
    return function linkFn (scope, elem, attrs) {
        var height;
        var width
        elem.on("change", function (e) {
            /**********************/
            var reader = new FileReader();

            //Read the contents of Image File.
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function (e) {

            //Initiate the JavaScript Image object.
                var image = new Image();

            //Set the Base64 string return from FileReader as source.
                image.src = e.target.result;

            //Validate the File Height and Width.
                image.onload = function () {
                    height = this.height;
                    width = this.width;
                    if (height > 1000 || width > 1000) {
                        alert("Height and Width must not exceed 100px. Current Height: "+height+" and Current Width: "+width);
                        return false;
                    }
                    alert("Uploaded image has valid Height and Width.");
                    return true;
                };
            }
            /**********************/


            scope.$eval(attrs.myFiles + "=$files", {$files: e.target.files});
            scope.$apply();

        })
    }
});

app.directive("fileinput", [function() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "="
        },
        link: function(scope, element, attributes) {
            var _URL = window.URL || window.webkitURL;
            element.bind("change", function(changeEvent) {
                try {
                    scope.fileinput = changeEvent.target.files[0];
                    var file=changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        //var blob = new Blob([file], {type: 'image/jpeg'});
                        scope.$apply(function() {
                            scope.filepreview = loadEvent.target.result;
                            var obj={
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                src: loadEvent.target.result
                            };
                            scope.fileinput = obj;
                        });
                    }
                    reader.readAsDataURL(file);
                }catch (e) {
                    var obj={
                        name: "No File",
                        size: 0,
                        type: "",
                        src: "no source"
                    };
                    scope.$apply(function() {
                        scope.filepreview={};
                        scope.fileinput = obj;
                    });

                }


            });
        }
    }
}]);


app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                    });
                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);
                    return deferred.promise;
                }
            }); //change

        } //link
    }; //return
});


app.directive("selectNgFiles", function() {
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            elem.on("change", function(e) {
                var files = elem[0].files;
                ngModel.$setViewValue(files);
            })
        }
    }
});



app.directive('imgUpload', function($http, $compile) {
    return {
        restrict: 'AE',
        scope: {
            url: '@',
            method: '@',
        },
        template:
            '<input class="fileUpload" type="file" multiple />' +
            '<div class="dropzone">' +
            '<p class="msg">Click or Drag and Drop files to upload</p>' +
            '</div>' +
            '<div class="preview clearfix">' +
            '<div class="previewData clearfix" ng-repeat="data in previewData track by $index">' +
            '<img src={{data.src}}></img>' +
            '<div class="previewDetails">' +
            '<div class="detail"><b>Name : </b>{{data.name}}</div>' +
            '<div class="detail"><b>Type : </b>{{data.type}}</div>' +
            '<div class="detail"><b>Size : </b> {{data.size}}</div>' +
            '</div>' +
            '<div class="previewControls">' +
            '<span ng-click="upload(data)" class="circle upload">' +
            '<i class="fa fa-check"></i>' +
            '</span>' +
            '<span ng-click="remove(data)" class="circle remove">' +
            '<i class="fa fa-close"></i>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>',
        link: function(scope, elem, attrs) {
            var formData = new FormData();
            scope.previewData = [];

            function previewFile(file) {
                var reader = new FileReader();
                var obj = new FormData().append('file', file);
                reader.onload = function(data) {
                    var src = data.target.result;
                    var size =
                        file.size / (1024 * 1024) > 1
                            ? file.size / (1024 * 1024) + ' mB'
                            : file.size / 1024 + ' kB';
                    scope.$apply(function() {
                        scope.previewData.push({
                            name: file.name,
                            size: size,
                            type: file.type,
                            src: src,
                            data: obj,
                        });
                    });
                    console.log(scope.previewData);
                };
                reader.readAsDataURL(file);
            }

            function uploadFile(e, type) {
                e.preventDefault();
                var files = '';
                if (type == 'formControl') {
                    files = e.target.files;
                } else if (type === 'drop') {
                    files = e.originalEvent.dataTransfer.files;
                }
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (file.type.indexOf('image') !== -1) {
                        previewFile(file);
                    } else {
                        alert(file.name + ' is not supported');
                    }
                }
            }
            elem.find('.fileUpload').bind('change', function(e) {
                uploadFile(e, 'formControl');
            });

            elem.find('.dropzone').bind('click', function(e) {
                $compile(elem.find('.fileUpload'))(scope).trigger('click');
            });

            elem.find('.dropzone').bind('dragover', function(e) {
                e.preventDefault();
            });

            elem.find('.dropzone').bind('drop', function(e) {
                uploadFile(e, 'drop');
            });
            scope.upload = function(obj) {
                $http({
                    method: scope.method,
                    url: scope.url,
                    data: obj.data,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity,
                }).success(function(data) {});
            };

            scope.remove = function(data) {
                var index = scope.previewData.indexOf(data);
                scope.previewData.splice(index, 1);
            };
        },
    };
});

app.factory('UserService', function ($resource,$cookies) {
    return $resource('http://127.0.0.1/photography_api/public/api/v1/countries:user', {user: "@user"}, {
        get: {
            method: 'GET',
            headers: { 'authKey': $cookies.get('authToken') }
        }
    });
});

app.factory('ParticipantService', ['$resource','$cookies',
    function($resource,$cookies) {
        var resource =
            $resource(api_url+"/secure/participants", {
            }, {
                update: {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json','authKey':$cookies.get('authToken')},
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                },
                get: {
                    method: 'GET',
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                },
                save: {
                    method: 'POST',
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            result.$data=response.data;
                            //console.log(result);
                            return result;
                        }
                    }
                },
                delete: {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json' },
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                }
            });
        return resource;
    }]);

app.factory('RegistrationService', ['$resource','$cookies',
    function($resource,$cookies) {
        var resource =
            $resource(api_url1+"/v1/persons", {
            }, {
                update: {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json','authKey':$cookies.get('authToken')},
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                },
                get: {
                    method: 'GET',
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                },
                save: {
                    method: 'POST',
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            result.$data=response.data;
                            //console.log(result);
                            return result;
                        }
                    }
                },
                delete: {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json' },
                    interceptor: {
                        response: function(response) {
                            var result = response.resource;
                            result.$status = response.status;
                            result.$statusText = response.statusText;
                            result.$xhrStatus = response.xhrStatus;
                            return result;
                        }
                    }
                }
            });
        return resource;
    }]);


//Confirming Password
app.directive("compareTo", function () {
    return {
        require: "ngModel",
        scope:
            {
                repeatPassword: "=compareTo"
            },
        link: function (scope, element, attributes, paramval)
        {
            paramval.$validators.compareTo = function (val)
            {
                return val == scope.repeatPassword;
            };
            scope.$watch("repeatPassword", function ()
            {
                paramval.$validate();
            });
        }
    };
});

app.directive('disallowSpaces', function() {
    return {
      restrict: 'A',
  
      link: function($scope, $element) {
        $element.bind('input', function() {
          $(this).val($(this).val().replace(/ /g, ''));
        });
      }
    };
  });


app.directive('pkAudio', function () {
    return {
        restrict: 'A',
        scope: {
            pkAudio: '='
        },
        link: function (scope, element, attrs, ngModelCtrl) {

            var removeBehaviorsRestrictions = function() {
                // element.load();
                window.removeEventListener('keydown', removeBehaviorsRestrictions);
                window.removeEventListener('mousedown', removeBehaviorsRestrictions);
                window.removeEventListener('touchstart', removeBehaviorsRestrictions);
            };
            window.addEventListener('keydown', removeBehaviorsRestrictions);
            window.addEventListener('mousedown', removeBehaviorsRestrictions);
            window.addEventListener('touchstart', removeBehaviorsRestrictions);

            scope.pkAudio = element[0];
        }
    };
});

app.run(function($rootScope){
    $rootScope.roundNumber=function(number, decimalPlaces){
        return parseFloat(parseFloat(number).toFixed(decimalPlaces));
    };
});