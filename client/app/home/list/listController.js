angular.module('app.home.list', [])
.controller('listController', function ($scope, Url, ipCookie) {
  //angular-tour settings cookie
  $scope.currentStep = ipCookie('myBasicTour') || 0;
  // save cookie after each step
  $scope.stepComplete = function() {
    ipCookie('myBasicTour', $scope.currentStep, { expires: 3000 });
  };
  
  $scope.getUrls = function () {
    console.log('in home results');
    Url.getUrls(function (err, urls) {
      if (err) {
        $scope.error = 'We can´t retrieve the URLS';
      }else {
        console.log('urls are:',url)
        $scope.setUrls(urls);
      }
    });
  };

  $scope.getUrls();

});

