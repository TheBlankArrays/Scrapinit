angular.module('app.home', ['app.home.urlImage', 'app.home.list', 'ui.router'])

.controller('homeController', function ($scope, $state, $http, Url) {
  $scope.url = 'http://';
  $scope.urls = [];
  $scope.loading = false;
  $scope.urlImagePreview = '';
  $scope.$on('emptyUrls', function () {
    $scope.url = 'http://';
    $scope.urlImagePreview = '';
    $scope.loading = false;
  });



  $scope.logout = function () {
   $http.get("/api/users/logout")
     .success(function (data) {
       $state.go('login');
     });
  };

  $scope.setUrls = function (urlsObject) {
    $scope.urls = urlsObject;
  };

  $scope.add = function () {
    $scope.loading = true;
    $http.get('/api/screenshot?url=' + $scope.url )
     .success(function (data) {
      $scope.urlImagePreview = data;
      $state.go('home.urlImage');

     });

  };
  $state.go('home.list');

})
.factory('Url', function ($http) {
  var getUrls = function (callback) {
    $http({
      method: 'GET',
      url: '/api/users/list'
    })
    .success(function(data) {
    
      var urls = [];
      var urlArray = data.urls;
      console.log('data - ', data);
      for (var i = 0; i < urlArray.length; i++) {
        urls.push({url: urlArray[i].url, img: urlArray[i].UserUrl.cropImage});
      }
      callback(false, urls);
    })
    .error(function(err) {
      callback(true);
    });
  };

  var postUrl = function (cropCoor, urlImg, url, callback) {
    $http.post('/api/users/url', {crop: cropCoor, urlImg: urlImg, url: url})
    .success(function (data) {
      callback(false, data);
    });
  };

  return {
    getUrls: getUrls,
    postUrl: postUrl
  }

});
