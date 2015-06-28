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
  getScreenshot: function(url, userId, cb, email) {

    console.log('userId in getscreenshot ' + userId);

    var urlWithoutHTTP = url.substring(url.indexOf("://") + 3)  // handle http AND https protocols
    urlWithoutHTTP = urlWithoutHTTP.replace(/[?/.=]/g, '_');    // change weird characters to underscore

    webshot(url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg', function(err) {
      // screenshot now saved to google.png// screenshot now saved to hello_world.png
      cb('assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg', email);
    });
  },

  cropImg: function(url, crop, compare, cb, email) {

    var filepath = url.substr(0, url.length - 12) + ((compare) ? '-compare.jpg' : '.jpg');

     gm('../client/' + url).crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + filepath, function(err){
        if (err) return console.dir(arguments)
        cb(filepath, crop, email);
      });

  }

};
