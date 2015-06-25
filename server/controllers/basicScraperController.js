var request = require('request');
var validator = require('validator');
var webshot = require('webshot');
var easyimg = require('easyimage');
var gm = require('gm').subClass({ imageMagick: true });

var validProtocols = {
  'http': 'true',
  'https': 'true'
}

module.exports = {
  getScreenshot: function(url, userId, cb) {

    var urlWithoutHTTP = url.substr(7);
    webshot(url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '.jpg', function(err) {
      // screenshot now saved to google.png// screenshot now saved to hello_world.png
      cb('assets/' + userId + '/' + urlWithoutHTTP + '.jpg');
    });
  },
  cropImg: function(url, crop, cb) {
    console.log(url);
    console.log(JSON.stringify(crop));

    gm('../client/' + url)
      .crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + url, function(err){
        if (err) return console.dir(arguments)
        cb('../client/' + url, crop);
      }
    )

  }
};
