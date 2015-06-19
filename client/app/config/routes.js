/*
 * Routing angular application
 * set State, url, templateUrl and controller
*/
angular.module('app.routes', ['ui.router'])
.config(
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/login");
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/user/signup.html',
        controller: 'userController'
      }) 
      .state('login', {
        url: '/login',
        templateUrl: 'app/user/login.html',
        controller: 'userController'
      });
  });

