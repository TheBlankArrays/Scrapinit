angular.module('app.home.addUrl', [])
.controller('addUrlController', function ($scope) {
  $scope.add = function(){
    console.log('addURL');
    $scope.renderUrl = $scope.url;
    $scope.url = ''; 
  }
});
