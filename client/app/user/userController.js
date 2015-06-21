angular.module('app.user', [])
.controller('userController', function ($scope, $state, User) {
  
  $scope.user = {};
  $scope.currentUser = {};

  $scope.login = function () {
    User.login($scope.user, function (err, user) {
      if (err) {
        $scope.error = 'Email or password is invalid';
      } else {
        $scope.currentUser = user;
        $state.go('home');
      }
    });
  };

  $scope.signup = function () {
    User.signup($scope.user, function (err, message) {
      if (err) {
        $scope.error = message;
      } else {
        $state.go('login');
      }
    });
  };

})
.factory('User', function($http) {

  var login = function (user, callback) {
    $http({
      method: 'POST',
      url: '/api/users/login',
      data: user,
    })
    .success(function (user) {
      callback(false, user);
    })
    .error(function (err) {
      callback(true, err);
    });
  };

  var signup = function (user, callback) {
    $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user,
    })
    .success(function (user) {
      callback(false);
    })
    .error(function (err) {
      callback(true, err);
    });
  };

  return {
    login: login,
    signup: signup
  }
});