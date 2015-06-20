angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state, $http) {

   $scope.html = 'dsad';
   $scope.urls = ['http://www.yahoo.com', 'http://adsense.com'];
   console.log($scope.urls);
   $scope.add = function() {

      $scope.theframe = $scope.url;


       $scope.urls.push($scope.url);
       var retreiveUrl = '/api/users/retrieveUrl';
      //  console.log($scope.urls);
       $http.post(retreiveUrl, {url: $scope.url })
         .success(function (data) {
          //  console.log(data);

           var ifrm = document.getElementById('theframe');
           ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
           ifrm.document.open();
           ifrm.document.write(data);
           ifrm.document.close();

         });
   };

});
