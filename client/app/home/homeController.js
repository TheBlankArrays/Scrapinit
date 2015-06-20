angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state) {
  $state.go('home.results');
  $scope.html= '';
  $scope.add = function() {
    $scope.html = 'newValues';
    $state.go('home.addUrl');
  }
});
