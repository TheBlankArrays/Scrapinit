var phantom = require('phantom');
var webshot = require('webshot');
var width = 2048;
var height = 1536;

var utils = {
  scrapeFullImage: function (url, file, userId, callback) {
    console.log('url', url);
    console.log('file', file);
    console.log('folder', userId);

    webshot(url, '../client/assets/' + userId + '/' + file,
      {
        screenSize: {
          width: 2048,
          height: 1536
        },
        shotSize: {
          width: 2048,
          height: 'all'
        },
        defaultWhiteBackground: true,
        quality: 100,
        renderDelay: 50,
        zoomFactor: 2
      }, function(err) {
          // screenshot now saved to google.png// screenshot now saved to hello_world.png
          console.log('err from scrape.js ' + err);
          if (!err) {
            callback('success', 'assets/' + userId + '/' + file);
          } else {
            callback(403, 'error');
          }
      });
  }
};

module.exports = utils;

