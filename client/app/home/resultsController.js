angular.module('app.home.results', [])
.controller('resultsController', function ($scope, Url) {
  console.log('app home results');


  $scope.getUrls = function () {
    console.log('in home results');
    Url.getUrls(function (err, urls) {
      if (err) {
        $scope.error = 'We can´t retrieve the URLS';
      }else {
        $scope.setUrls(urls);
      }
    });
  };

  $scope.getUrls();
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
      for (var i = 0; i < urlArray.length; i++) {
        $scope.urls.push({url: urlArray[i].url, img: urlArray[i].UserUrl.cropImage});
      }
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
