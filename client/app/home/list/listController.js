angular.module('app.home.list', ['toggle-switch'])
.controller('listController', function ($scope, Url) {
  console.log('app home results');


  $scope.switch = function (value){
    var decision = 'image';
    if (!value){
      decision = 'txt';
    }

console.log('user decision is' , decision)
}


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

