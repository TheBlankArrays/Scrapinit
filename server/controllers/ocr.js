var tesseract = require('node-tesseract');
var gm = require('gm').subClass({ imageMagick: true });

var obj = {
  convertImageToText : function(imagePath, cb){
    var imgPath = imagePath.lastIndexOf('../') > -1 ? '../' + imagePath.substr(imagePath.lastIndexOf('../') + 3) : imagePath;
    var filteredImage = imgPath.substring(0, imgPath.length-4) + '-filter.png';
    var imgFil = gm(imgPath).type('grayscale').enhance().unsharp(6.8, 1.0, 2.69, 0).resize(1200,2000).write(filteredImage, function (err) {
     if (err){
      console.log('image processing error', err)
      }
      tesseract.process(imgPath, function(err, text) {
        if(err) {
          cb(err);
        } else {
          var re = /\n/g;
          text = text.replace(re, ' ');
          text = text.trim();
          console.log('//////////////////////');
           console.log('text: ', text);
          cb(null, text);
        }
      });
    });
  }
};


module.exports = obj;
