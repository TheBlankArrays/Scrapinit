var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var resemble = require('resemblejs');
var resemble = require('node-resemble-js'); 
var path = require('path');

app.get('/', function(req, res){
  res.render('index');
});


 var port = process.env.PORT || 3001;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });


// //////////////   RESEMBLE    /////////////////
// var resemble = require('node-resemble-js'); 

// var imgA = 'image1.png';
// var imgB = 'image2.png';
// var imgC = 'image3.png';

// var imgD = 'screenshot1.png';
// var imgE = 'screenshot2.png';

// var imgF = './images/screenshot1.png';
// var imgG = './images/screenshot2.png';

// var imgX = './client/assets/BbRKwbk69wJmh8YW-G5QkdNquxJ_6EyB/google.com.png';       
// var imgY = './client/assets/BbRKwbk69wJmh8YW-G5QkdNquxJ_6EyB/google.com-preview.png';       


// resemble(imgX).compareTo(imgY).ignoreColors().onComplete(function(data){
//                 console.log('RESEMBLE: ',data);
//                 });

// // var api = resemble(imgB).onComplete(function(data){
// //     console.log(data);
// //   })
             
// /////////////////// imgage-diff
// var imageDiff = require('image-diff');
// var path = require('path');

// var img1 = './client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
// var img2 = './client/assets/qvNot4g0dBZNio45GtwpXfopy8poLxm8/google.com.jpg';
// var img3 = './client/assets/BbRKwbk69wJmh8YW-G5QkdNquxJ_6EyB/google.com.jpg';       

// var a1 = path.join(__dirname, img1);
// var a2 = path.join(__dirname, img2);
// var a3 = path.join(__dirname, img3);


// imageDiff({
//   actualImage: a1,
//   expectedImage: a2,
//   diffImage: 'difference.png',
// }, function (err, imagesAreSame) {
//   console.log('IMAGE DIFF : images are the same: ',imagesAreSame)
//   // error will be any errors that occurred 
//   // imagesAreSame is a boolean whether the images were the same or not 
//   // diffImage will have an image which highlights differences 
// });

