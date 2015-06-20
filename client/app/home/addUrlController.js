angular.module('app.home.addUrl', [ 'ui.router'])
.controller('addUrlController', function ($scope, $state, $http) {
 $scope.html = '';

 $scope.add = function() {
     var loginUrl = '/user/url';
     console.log('urlCtrl');
     $http.post(loginUrl, {url: $scope.url })
       .success(function (data) {
         console.log(data);
         $scope.html = 'newValues';
         $state.go('home.addUrl');
       });
 };
});