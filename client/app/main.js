/*
 * Without backend server we need to run the following command
 * python -m SimpleHTTPServer
 * to load templateURL from app.routes
**/
angular.module('app', [
  'app.routes',
  'app.user',
  'app.home',
  'ui.router',
  'ngDialog'
])
.controller('appController', function($scope) {
})
.factory('Auth', function($http){
  var user;

  return{
    setUser : function(aUser){
        user = aUser;
    },
    isLoggedIn : function(callback){
      $http.get('/api/users/check_User')
        .success(function (data) {
          console.log('checkuser ' + data);
          callback(data);
        });
    }
  }
})
.run(function ($rootScope, $state, Auth) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    Auth.isLoggedIn(function(loggedIn) {
      if (toState.auth && !loggedIn && toState.name !== "login" && toState.name !== "signup" ) {
        $state.go('welcome');
      }
    });
  });
});
