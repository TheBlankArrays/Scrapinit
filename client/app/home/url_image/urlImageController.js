angular.module('app.home.urlImage', [ 'ui.router'])
.controller('urlImageController', function ($scope, $state, $http) {

 $scope.html = '';

 $scope.add = function() {
     var loginUrl = '/api/users/retrieveUrl';
     console.log('urlCtrl');
     $http.post(loginUrl, {url: $scope.url })
       .success(function (data) {
         console.log(data);
         $scope.html = 'newValues';
         $state.go('login');
       });
 };
});