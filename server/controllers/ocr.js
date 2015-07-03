var tesseract = require('node-tesseract');
var gm = require('gm').subClass({ imageMagick: true });

var obj = {
  convertImageToText : function(imagePath, cb){ 
    console.log('imagePath', imagePath)
    var current = imagePath.split('../');
    var imgPath = '../'+current[2];
    console.log('imgpath', imgPath)
    //var filteredImg =imgPath.slice(0,imgPath.length-3)+"tiff";
    // console.log('fil', filteredImg)
    var imgFil = gm(imgPath).type('grayscale').enhance().unsharp(6.8, 1.0, 2.69, 0).resize(1200,2000).write(imgPath, function (err) {
     if (err){
      console.log('image processing error', err)
      }
     }); 

    // sample anonoymous function(stats, text){};
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
  },
};


module.exports = obj;
