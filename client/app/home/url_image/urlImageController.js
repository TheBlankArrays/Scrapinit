angular.module('app.home.urlImage', [ 'ui.router'])
.controller('urlImageController', function ($scope, $state, Url, ipCookie) {

  // frequency select options
  $scope.freq_options = [
      {
        name: '20 seconds',
        value: '*/20 * * * * *'
      },
      {
        name: '5 min',
        value: '1 */5 * * * *'
      },
      {
        name: '30 min',
        value: '1 */30 * * * *'
      },
      {
        name: '1 hour',
        value: '1 1 */1 * * *'
      },
      {
        name: '4 hours',
        value: '1 1 */4 * * *'
      },
      {
        name: 'daily',
        value: '1 1 1 */1 * *'
      },
      {
        name: 'weekly',
        value: '1 1 1 */7 * *'
      }
  ];

  $scope.trig_options = [
      {
        name: 'change',
        value: 'null'
      },
      {
        name: 'greater than',
        value: 'greater'
      },
      {
        name: 'less than',
        value: 'less'
      },
      {
        name: 'contains',
        value: 'contains'
      }
  ];

  //angular-tour settings cookie
  $scope.currentStep = ipCookie('myImageTour') || 0;
  // save cookie after each step
  $scope.stepComplete = function() {
    ipCookie('myImageTour', $scope.currentStep, { expires: 3000 });
  };

  // url scrape type select watcher
  $scope.$watch('enabled', function (newVal) {
   if (newVal) {
     $('#extras').slideDown();
   } else {
     $('#extras').slideUp();
   }
  });

  //finish angular-tour settings cookie

  $scope.send = function () {
    var urlType = ($scope.enabled) ? 'Text' : 'Image';
    Url.postUrl($scope.cropCoords, $scope.urlImagePreview, $scope.url, urlType, $scope.freq, $scope.trig, $scope.compareValue, $scope.stopOnTrig, function (err, data) {
      if (err) {
        $scope.error = 'UPS! We are in troubles.';
      }else {
        $scope.$emit('emptyUrls');
        $state.go('home.list');
      }
    });
  };

  $scope.setCrop = function(cropCoor) {
    $scope.cropCoords = cropCoor;
  }

})
.directive('setCrop', function () {

  var linker = function(scope, element, attrs){
    element.Jcrop({
      onSelect: function (c) {
        //$(element).fadeOut(800);
        $("#infoText").fadeOut(800, function() {
          $(this).slideUp('slow', function() {
            $(this).remove();
          });
        });
        $('#options-panel').slideDown();
        $('html, body').animate({
            scrollTop: $("#options-panel").offset().top - 100
        }, 2000);

        for (key in c) {
          c[key] = c[key] * 2.56;
        }
        console.log('crop directive cropcoor', c);
        scope.setCrop({cropCoor: c});
      }
    });
  };

  return {
    restrict: 'A',
    scope: {
      setCrop: '&',
    },
    link: linker
  }
})
.directive('imageonload', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.on('load', function() {
        $('#loadingpage').hide();
        //$(element).slideDown();
      });
      // scope.$watch('ngSrc', function() {
      // });
    }
  }
});
