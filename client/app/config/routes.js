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
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        controller: 'homeController'
      })
      .state('home.addUrl', {
        url: 'addUrl',
        templateUrl: 'app/home/add_url.html',
        controller: 'addUrlController'
      })
      .state('home.results', {
        url: 'results',
        templateUrl: 'app/home/results.html',
        controller: 'resultsController'
      });
  });
