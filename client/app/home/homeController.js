angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state) {
<<<<<<< HEAD
  $state.go('home.addUrl');
  $scope.add = function() {
    console.log('home');
    $scope.html = $scope.url;
    $scope.url = ''; 
=======
  $scope.html = '';
  $scope.add = function() {
    console.log(url.value);

    $scope.input = { somedata: '' };

    $scope.myFunc = function(value){
        $scope.input.somedata = value.toUpperCase();
    }

    $scope.html = 'newValues';
    $state.go('home.addUrl');
>>>>>>> [Feature] allowed for url submission in client and connection through to server with response
  }
});
