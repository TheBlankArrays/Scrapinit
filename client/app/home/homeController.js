angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state) {
  $state.go('home.addUrl');
  $scope.add = function() {
    console.log('home');
    $scope.html = $scope.url;
    $scope.url = ''; 
  }
});
