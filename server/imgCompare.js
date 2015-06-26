var imageDiff = require('image-diff');
var path = require('path');

module.exports = {

  compare: function (image1, image2) {
     

    var newDirName = __dirname + '../';
    var newDir = __dirname.slice(0,-6);
    var img1 = path.join(newDir,'client', image1);
    var img2 = path.join(newDir,'client', image2);
    console.log('image1:', img1)
    console.log('image2:', img2)


    imageDiff({
      actualImage: img1,
      expectedImage: img2,
      diffImage: 'difference.png',
    }, function (err, imagesAreSame) {
      console.log('IMAGE DIFF : images are the same: ',imagesAreSame)
    // error will be any errors that occurred 
    // imagesAreSame is a boolean whether the images were the same or not 
    // diffImage will have an image which highlights differences 
    });
  }
}