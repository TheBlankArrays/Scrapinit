var mocha = require('mocha');
var should = require('chai').should();
var expect = require('chai').expect;
var compare = 

describe('Image comparison', function() {
  var i = 'a';
   it('should return true', function(done) {
    expect(i).to.equal('a');
    done();
   });

   it('should return true when the same image is used', function (done) {
    var a1 = './Users/dominikabienkowska/Desktop/Scrapinit/server/specs/blankImage.jpg';
    var a2 = './Users/dominikabienkowska/Desktop/Scrapinit/server/specs/blankImage.jpg';
  imageDiff({
  actualImage: 'blankImage.png',
  expectedImage: 'redditImage1.jpg',
  diffImage: 'difference.png',
}, function (err, imagesAreSame) {
  console.log('IMAGE DIFF : images are the same: ',imagesAreSame)
   expect(imagesAreSame).to.equal(true);
return imagesAreSame
 // error will be any errors that occurred 
  // imagesAreSame is a boolean whether the images were the same or not 
  // diffImage will have an image which highlights differences 
});


    //compare(img1, img2, dir);
 
    done();
   })

});