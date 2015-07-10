/*
 * Routing angular application

 * set State, url, templateUrl and controller
*/
angular.module('app.routes', ['ui.router'])
.config(
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/welcome");
    $stateProvider
      .state('comingSoon', {
        url: '/comingSoon',
        templateUrl: 'app/home/comingSoon.html',
        controller: 'userController'
      })
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
      .state('home.urlImage', {
        url: 'url_image',
        templateUrl: 'app/home/url_image/url_image.html',
        controller: 'urlImageController',
        auth: true
      })
      .state('home.list', {
        url: 'list',
        templateUrl: 'app/home/list/list.html',
        controller: 'listController',
        auth: true
      });
  });
