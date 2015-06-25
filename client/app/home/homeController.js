angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router', ])
.controller('homeController', function ($scope, $state, $http) {


   $scope.url = 'http://';
   $scope.urls = [];
   $scope.loading = false;
   console.log($scope.urls);


   $scope.logout = function() {
     $http.get("/api/users/logout")
       .success(function (data) {
         $state.go('login');
       });
   };


  $scope.setUrls = function(urlsObject){
    $scope.urls = urlsObject;
  
  };

   $scope.add = function() {

      $scope.theframe = $scope.url;
      $scope.loading = true;

      //  console.log($scope.urls);
       $http.get('/api/screenshot?url=' + $scope.url )
         .success(function (data) {

            console.log('received response from server: ' + data);

           var img = $("<img src='" + data + "' />");
           $('#imgview').html(img);
           $('#imgview').fadeIn(100);

           var selectedCrop = function(c) {
             $('#imgview').fadeOut(800);
             $http.post('/api/users/url', {crop: c, urlImg: data, url: $scope.url})
                .success(function (data) {
                  console.log('url response: ' + JSON.stringify(data));
                  if (data !== 'error') {
                    $scope.urls.push({url: $scope.url, img: data[0][0].cropImage});
                  }
                  $scope.loading = false;
                })
           };

         	 img.Jcrop({
              onSelect: selectedCrop
           });

         });

         // $http.post('/api/users/retrieve_url', {url: $scope.url })
         //   .success(function (data) {
         //     //console.log(data);
         //     $scope.html = data;
         //    //  var ifrm = document.getElementById('theframe');
         //    //  ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
         //    //  ifrm.document.open();
         //    //  ifrm.document.write(data);
         //    //  ifrm.document.close();

         //   });
   };
   console.log('going to results');
  $state.go('home.results');
});
