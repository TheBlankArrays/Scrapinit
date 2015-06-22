angular.module('app.home.results', [])
.controller('resultsController', function ($scope, Url) {

  $scope.getUrls = function () {
    Url.getUrls(function (err, urls) {
      if (err) {
        $scope.error = 'We can´t retrieve the URLS';
      }else {
        $scope.setUrls(urls);
      }
    });
  };

})
.factory('Url', function ($http) {

  var getUrls = function (callback) {
    $http({
      method: 'GET',
      url: '/api/users/urls'
    })
    .success(function(urls) {
      callback(false, urls);
    })
    .error(function(err) {
      callback(true);
    });
  };

  return {
    getUrls: getUrls
  }

});
