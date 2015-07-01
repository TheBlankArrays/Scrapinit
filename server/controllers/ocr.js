var tesseract = require('node-tesseract');


// Recognize text of any language in any format
module.exports = {
  convertImageToText : function(imagePath, success, error){
    tesseract.process('../../client/assets/' + imagePath, function(err, text) {
      if(err) {
        error(err);
      } else {
        success(text);
      }
    }); 
  }
}


