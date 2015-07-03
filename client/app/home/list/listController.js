angular.module('app.home.list', [])
.controller('listController', function ($scope, Url) {
  $scope.getUrls = function () {
    console.log('in home results');
    Url.getUrls(function (err, urls) {
      if (err) {
        $scope.error = 'We can´t retrieve the URLS';
      }else {
        console.log('urls are:',url)
        $scope.setUrls(urls);
      }
    });
  };

  $scope.getUrls();

});

