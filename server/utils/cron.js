var basicScraper = require('../controllers/basicScraperController');
var getExternalUrl = require('../controllers/urlController').getExternalUrl;
var compare = require('../imgCompare').compare;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var nodemailer = require('nodemailer');
var ocr = require('./controllers/ocrController.js');
var secret = require('../config.js');
var Sequelize = require('sequelize');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});

module.exports = {

  getDate: function() {
    var date = new Date();
    var options = {
      year: "numeric", month: "2-digit",
      day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options);
  },

  getNewCroppedImage: function(UserUrl, website, email, params, oldImg, cb) {
    basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
      // crops new image so we can compare the the old cropped image
      basicScraper.cropImg(img1, params, true, function(newImg) {
        // checks for difference in pictures
        cb(oldImg, newImg)
      }); // basicScraper.cropImg(img1, params, true, function(img2) {
    }, email); // basicScraper.getScreenshot()
  },

  compareOCR: function(UserUrl, website, email, params, oldImg, cb) {
    // TODO: take values that are input to it, pass it through compare ocr functions? Should be in basicScroperController?
    this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
      console.log('inside ocrCompare, oldImg', oldImg, 'newImg', newImg);
      console.log('dirname is ', __dirname); //
      /*
      have: /Users/banana/Projects/gitinit/loveBiscuits/server
      want: /Users/banana/Projects/gitinit/loveBiscuits/client/
      */

        newImg = __dirname.substr(0, __dirname.length - 12) + 'client/' + newImg;
        ocr.convertImageToText(newImg, function(err, text) {
          if (err) {
            console.log('ocr error' + err);
          } else {
            console.log('comparing text values');
            if (UserUrl.filter === 'greater') {
              console.log('TESTING greater')
              // pulls first set of numbers from text
              if (text.match(/\d+\.?\d*/gi)) {
                var compareVal = text.match(/\d+\.?\d*/gi)[0];
              }
              console.log('compareVal is', compareVal);
              if (compareVal < UserUrl.compareVal) {
                cb(oldImg, newImg);
              }
            } else if (UserUrl.filter == 'less') {
              console.log('TESTING less')
              // TODO: pull numeric value from text
              if (text.match(/\d+\.?\d*/gi)) {
                var compareVal = text.match(/\d+\.?\d*/gi)[0];
              }
              console.log('the compareVal is ', compareVal);
              if (compareVal > UserUrl.compareVal) {
                cb(oldImg, newImg);
              }
            } else if (UserUrl.filter == 'contains') {
              console.log('TESTING contains')
              // if a user wants to check for multiple words
              var contains = UserUrl.compareVal.split(',') || UserUrl.compareVal;
              // iterate through each word
              for (var i = 0; i < contains.length; i++) {
                // if text contains any of the values
                if (text.indexOf(contains[i])) {
                  cb(oldImg, newImg);
                } // if (text.indexOf(contains[i])) {
              } // for (var i = 0; i < contains.length; i++) {
            }  else {
              if (UserUrl.cronVal !== text) {
               cb(oldImg, newImg);
              } // if (UserUrl.cronVal !== text) {
            };
          }; // } else {
        }); // ocr.converImageToText(newImg, function(newImg) {
    }); //this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
  },

  compareScreenShot: function(UserUrl, website, email, params, oldImg, cb) {
    this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
      // checks for difference in pictures
      compare(oldImg, newImg, function (equal, oldImg, newImg){
        console.log('logic is reached');
        if (!equal){
          cb(oldImg, newImg);
        }; // if (!equal){
      }); // compare(img1, img2, function (equal){
    });
  },

  sendEmail: function(website, email, oldImg, newImg) {
    console.log('change detected on', website, 'sending email to ', email);
    // parameters for email

    // TODO: Add different mail options for different comparison funcitons.
    var mailOptions = {
        from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
        to: email, // list of receivers
        subject: 'We found some tubular changes!', // Subject line
        text: 'Hi there! It looks like we found a change on '+ website + '!', // plaintext body
        html: "<span>The Scrapinit team found a change on " + website +"!</span>",
        attachments: [
        {
          path: oldImg
        },
        {
          path: newImg
        }
        ]
    };

    // Send email function
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }; // else statemenet
    }); // transporter.sendMail(mailOptions, function(error, info){
  } // sendEmail: function(website, email) {
}
