var ocr = require('../controllers/ocr.js');
var should = require('should');
var assert = require('assert');
var expect = require('expect.js');

//works!
describe('Image-to-text conversion', function(){
  var path =  '../../client/assets/1/';
  it('should return error if invalid path is input', function(done){
    url = 'fakePath'; 
    ocr.convertImageToText(path + url, function(error, text){
      expect(!!error).to.equal(true);
      done();
    });
  });

  it('should not return anything when image, without text, is processed', function(done){ 
    url = 'www_google_com_fonts.jpg'; 
    ocr.convertImageToText(path + url, function(error, text){
     console.log(error);
     expect(error).to.equal(null);
     expect(text).to.equal('');
     done();
   });
  });

  it('should not return anything when image, without text, is processed', function(done){ 
    url = 'www_facebook_com.jpg'; 
    ocr.convertImageToText(path + url, function(error, text){
     expect(error).to.equal(null);
     expect(text).to.equal('Connect with friends and the world around you on Facebook.');
     done();
   });
  });

  it('should text convert an that reads "Open Sans" as such', function(done){ 
    url = 'www_fontsquirrel_com_fonts_list_popular.jpg'; 
    ocr.convertImageToText(path + url, function(error, text){
     expect(error).to.equal(null);
     expect(text).to.equal('Open Sans');
     done();
    });
  });

  it('should text convert an that reads "Open Sans" as such', function(done){ 
    url = 'www_google_com.jpg'; 
    ocr.convertImageToText(path + url, function(error, text){
     expect(error).to.equal(null);
     expect(text).to.equal('A faster way to browse the web');
     done();
   });
  });

});
