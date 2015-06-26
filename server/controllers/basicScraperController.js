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
    webshot(url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg', function(err) {
      // screenshot now saved to google.png// screenshot now saved to hello_world.png
      cb('assets/' + userId + '/' + urlWithoutHTTP + '-preview.jpg');
    });
  },
  cropImg: function(url, crop, cb, compare) {
    console.log(url);
    console.log(JSON.stringify(crop));
<<<<<<< HEAD
    if (compare) {
      .crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + url.substr(0, url.length - 12) + 'compare.jpg' , function(err){
        if (err) return console.dir(arguments)
        cb(url.substr(0, url.length - 12) + 'compare.jpg', crop);
      }
    } else {
    gm('../client/' + url)
=======

    if (compare) {
      gm('../client/' + url)
>>>>>>> [Feat] added compare parameter to cropImg so crop doesn't overwrite file when comparing file
      .crop(crop.w, crop.h, crop.x, crop.y)
      .write('../client/' + url.substr(0, url.length - 12) + 'compare.jpg' , function(err){
        if (err) return console.dir(arguments)
        cb(url.substr(0, url.length - 12) + '.jpg', crop);
      }
<<<<<<< HEAD
    }
=======
    } else {
      gm('../client/' + url)
        .crop(crop.w, crop.h, crop.x, crop.y)
        .write('../client/' + url.substr(0, url.length - 12) + '.jpg' , function(err){
          if (err) return console.dir(arguments)
          cb(url.substr(0, url.length - 12) + '.jpg', crop);
        }
      
    }

>>>>>>> [Feat] added compare parameter to cropImg so crop doesn't overwrite file when comparing file
    )

  }
};
