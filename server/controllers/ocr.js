var tesseract = require('node-tesseract');


// Recognize text of any language in any format
var obj = {
  convertImageToText : function(imagePath, cb){

    tesseract.process('../../client/assets/' + imagePath, function(err, text) {
      if(err) {
        cb(err, null);
      } else {
        cb('succcess', text);
      }
    }); 
  },
  compareOCR : function(imagePath1, imagePath2, cb){
   //get image of image 1
   //get image of imgage 2
   
   ocr.convertImageToText(imagePath1, function(status1, text1){
      //if status is not success, text will be null
      
      if(status1 === 'success'){
        ocr.convertImageToText(imagePath2, function(status2, text2){
          if(status2 === 'success'){
            cb('success', text1, text2);
          } else {
            //status2 failed
            cb('error', null, null);
          }
        });
      } else {
        //status1 failed
        cb('error', null, null);
      }
    });
  }

};



module.exports = obj;
