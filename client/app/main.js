/*
 * Without backend server we need to run the following command
 * python -m SimpleHTTPServer
 * to load templateURL from app.routes
**/
angular.module('app', [
  'app.routes',
  'app.user',
  'app.home',
  'ui.router'
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
      $http.get('/api/users/checkUser')
        .success(function (data) {
          console.log('checkuser ' + data);
          callback(data);
        });
    }
  }
})

.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
    //any url that doesn't exist in routes redirect to '/'
      .otherwise('/');

     //Do other stuff here
 })
.run(function ($rootScope, $location, Auth) {
// Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      Auth.isLoggedIn(function(loggedIn) {
        if (!loggedIn) {
              $rootScope.returnToState = toState.url;
              $rootScope.returnToStateParams = toParams.Id;
              $location.path('/login');
          }
      });
    });
});
