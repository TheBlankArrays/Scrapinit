angular.module('app.home.list', [])
.controller('listController', function ($scope, Url, ipCookie, ngDialog) {
  //angular-tour settings cookie
  $scope.currentStep = ipCookie('myBasicTour') || 0;
  // save cookie after each step
  $scope.currentText = undefined;
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

  $scope.remove = function(url) {
    console.log('remove url: ' + url);
    Url.removeUrl(url, function(success) {
      console.log('SUCCESS!' + success);
      if (success) {
        $scope.removeUrl(url);
      }
    });
  }

  $scope.getUrls();

  $scope.open = function (url) {
    var str = '<img src="'+ url +'" </img>';
    ngDialog.open({ 
      template: str,
      className: 'ngdialog-theme-plain',
      plain: true
    });
  
  };



})
.filter('domain', function ($document) {
  return function (input) {
    var parser = document.createElement('a');
    parser.href = input;
    return parser.hostname;
  }
});
