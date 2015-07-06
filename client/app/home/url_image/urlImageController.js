angular.module('app.home.urlImage', [ 'ui.router'])
.controller('urlImageController', function ($scope, $state, Url, ipCookie) {

  // frequency select options
  $scope.options = [
      {
        name: '1 min',
        value: '* */1 * * * *'
      },
      {
        name: '5 min',
        value: '* */5 * * * *'
      },
      {
        name: '30 min',
        value: '* */30 * * * *'
      },
      {
        name: '1 hour',
        value: '* * */1 * * *'
      },
      {
        name: '4 hours',
        value: '* * */1 * * *'
      },
      {
        name: 'daily',
        value: '* * * */1 * *'
      },
      {
        name: 'weekly',
        value: '* * * */7 * *'
      }
  ];


  //angular-tour settings cookie
  $scope.currentStep = ipCookie('myImageTour') || 0;
  // save cookie after each step
  $scope.stepComplete = function() {
    ipCookie('myImageTour', $scope.currentStep, { expires: 3000 });
  };
  //finish angular-tour settings cookie
  $scope.send = function (cropCoor) {
   console.log('user selected this option:', $scope.userDecision)
    Url.postUrl(cropCoor, $scope.urlImagePreview, $scope.url, $scope.userDecision, $scope.freq, function (err, data) {
      if (err) {
        $scope.error = 'UPS! We are in troubles.';
      }else {
        $scope.$emit('emptyUrls');
        $state.go('home.list');
      }
    });
  };

})
.directive('crop', function () {

  var linker = function(scope, element, attrs){
    element.Jcrop({
      onSelect: function (c) {
        $(element).fadeOut(800);
        for (key in c) {
          c[key] = c[key] * 2.56;
        }
        scope.crop({cropCoor: c});
      }
    });
  };

  return {
    restrict: 'A',
    scope: {
      crop: '&',
    },
    link: linker
  }
});
