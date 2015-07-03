var tesseract = require('node-tesseract');
var gm = require('gm').subClass({ imageMagick: true });

var obj = {
  convertImageToText : function(imagePath, cb){     // sample anonoymous function(stats, text){};
    tesseract.process(imagePath, function(err, text) {
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
