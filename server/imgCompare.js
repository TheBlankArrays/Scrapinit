var imageDiff = require('image-diff');
var path = require('path');

module.exports = {

  compare: function (image1, image2) {
    // var img1 = './client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
    // var img2 = './client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
    // var img3 = './client/assets/BbRKwbk69wJmh8YW-G5QkdNquxJ_6EyB/google.com.jpg';       
    console.log('image1', image1)
    console.log('__dir', __dirname)
    var newDirName = __dirname + '../';
    var newDir = __dirname.slice(0,-6);
    console.log('newDir',newDir)
    var a1 = path.join(newDir,'client', image1);
    var a2 = path.join(newDir,'client', image2);
    console.log('a1', a1)
    console.log('a2', a2)


// a1= '/Users/dominikabienkowska/Desktop/Scrapinit/client/assets/-0cvRcQCJRzYSJPBvytR5y4zVIPjTPRl/google.com.jpg';
// a2 ='/Users/dominikabienkowska/Desktop/Scrapinit/client/assets/1/google.comcompare.jpg';
    imageDiff({
      actualImage: a1,
      expectedImage: a2,
      diffImage: 'difference.png',
    }, function (err, imagesAreSame) {
      console.log('IMAGE DIFF : images are the same: ',imagesAreSame)
    // error will be any errors that occurred 
    // imagesAreSame is a boolean whether the images were the same or not 
    // diffImage will have an image which highlights differences 
    });
  }
}