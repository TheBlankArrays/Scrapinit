angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state, $http) {

   $scope.html = '';
   $scope.urls = [];
   console.log($scope.urls);

   $scope.logout = function() {
     $http.get("/api/users/logout")
       .success(function (data) {
         $state.go('login');
       });
   }
   $scope.add = function() {

      $scope.theframe = $scope.url;


       $scope.urls.push($scope.url);
      //  console.log($scope.urls);
       $http.post('/api/users/addUrl', {url: $scope.url })
         .success(function (data) {
           //console.log(data);



          //  $('#siteimg').css("background-image",'url(' + data + ')');
         // 	 $('#siteimg').Jcrop({
          //  });


         });

         $http.post('/api/users/retrieve_url', {url: $scope.url })
           .success(function (data) {
             //console.log(data);
             $scope.html = data;
            //  var ifrm = document.getElementById('theframe');
            //  ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            //  ifrm.document.open();
            //  ifrm.document.write(data);
            //  ifrm.document.close();

           });
   };

});
