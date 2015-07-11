angular.module('app.home', ['app.home.urlImage', 'app.home.list', 'ui.router', 'uiSwitch', 'angular-tour', 'ivpusic.cookie'])

.controller('homeController', function ($scope, $state, $http, Url, ipCookie) {
  //finish angular-tour settings cookie
  $scope.urls = [];
  $scope.loading = false;
  $scope.urlImagePreview = '';
  $scope.userDecision = 'text';
  $scope.url = 'http://';

  $scope.$on('emptyUrls', function () {
    $scope.url = 'http://';
    $scope.urlImagePreview = '';
    $scope.loading = false;
  });

  $scope.logout = function () {
   $http.get('/api/users/logout')
     .success(function (data) {
       $state.go('welcome');
     });
  };

  $scope.setUrls = function (urlsObject) {
    $scope.urls = urlsObject;
  };

  $scope.add = function () {
    $scope.loading = true;
    $http.post('/api/screenshot', {url: $scope.url })
     .success(function (data) {
      $scope.urlImagePreview = data;
      $state.go('home.urlImage');
     })
     .error(function(err) {
       console.log('error fetching screenshot');
       $scope.loading = false;
       $state.go('home.list');
     });
  };

  $scope.removeUrl = function(url) {
    for (var i = 0; i < $scope.urls.length; i++) {
      if ($scope.urls[i].url === url) {
        $scope.urls.splice(i, 1);
        break;
      }
    }
  }

  $state.go('home.list');

})
.factory('Url', function ($http) {
  var getUrls = function (callback) {
    $http({
      method: 'GET',
      url: '/api/users/list'
    })
    .success(function(data) {

      var urls = [];
      var urlArray = data.urls;
      console.log('data - ', data);

      var frequencyTable = {
          '*/20 * * * * *': '20 sec',
          '1 */5 * * * *': '5 min',
          '1 */30 * * * *': '30 min',
          '1 1 */1 * * *': '1 hour',
          '1 1 */4 * * *': '4 hours',
          '1 1 1 */1 * *': 'daily',
          '1 1 1 */7 * *': 'weekly'
      };

      for (var i = 0; i < urlArray.length; i++) {
        var curFreq = (frequencyTable[ urlArray[i].UserUrl.frequency ]) ? frequencyTable[ urlArray[i].UserUrl.frequency ] : '' ;
        urls.push({url: urlArray[i].url, img: urlArray[i].UserUrl.cropImage, text: urlArray[i].UserUrl.ocrText, comparison: urlArray[i].UserUrl.comparison, frequency: curFreq, latestScrape: urlArray[i].UserUrl.lastScrape});
      }
      callback(false, urls);
    })
    .error(function(err) {
      callback(true);
    });
  };

  var postUrl = function (cropCoor, urlImg, url, userDecision, freq, trig, compareVal, stopOnTrig, callback) {

    compareVal = compareVal || 'null';
    stopOnTrig = stopOnTrig || 'false';

    console.log(userDecision, 'userDecision');
    $http.post('/api/users/url', {
      crop: cropCoor,
      urlImg: urlImg,
      url: url,
      urlType: userDecision,
      freq: freq,
      filter: trig,
      compareVal: compareVal,
      stopOnTrig: stopOnTrig
    })
    .success(function (data) {
      callback(false, data);
    });
  };

  var removeUrl = function(url, callback) {
    $http.post('/api/users/removeUrl', {url: url})
       .success(function (data) {
         console.log('SUCCESS REMOVAL');
         callback(true);
       })
       .error(function(err) {
         callback(false);
       });
  }

  return {
    getUrls: getUrls,
    postUrl: postUrl,
    removeUrl, removeUrl
  }

});
