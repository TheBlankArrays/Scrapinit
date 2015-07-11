var basicScraper = require('../controllers/basicScraperController');
var getExternalUrl = require('../controllers/urlController').getExternalUrl;
var compare = require('../imgCompare').compare;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var nodemailer = require('nodemailer');
var ocr = require('../controllers/ocrController.js');
var secret = require('../../config.js');
var Sequelize = require('sequelize');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});

module.exports = {

  getDate: function() {
    var date = new Date();
    var options = {
      year: 'numeric', month: '2-digit',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return date.toLocaleTimeString("en-us", options);
  },

  getNewCroppedImage: function(UserUrl, website, email, params, oldImg, cb) {
    basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
      // crops new image so we can compare the the old cropped image
      basicScraper.cropImg(img1, params, true, function(newImg) {
        // checks for difference in pictures
        cb(oldImg, newImg)
      }); 
    }, email); 
  },

  compareOCR: function(UserUrl, website, email, params, oldImg, cb) {
    // TODO: take values that are input to it, pass it through compare ocr functions? Should be in basicScroperController?
    module.exports.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
      console.log('inside ocrCompare, oldImg', oldImg, 'newImg', newImg);

        newImg = __dirname.substr(0, __dirname.length - 12) + 'client/' + newImg;
        oldImg = __dirname.substr(0, __dirname.length - 12) + 'client/' + oldImg;
        ocr.convertImageToText(newImg, function(err, text) {
          if (err) {
            console.log('ocr error' + err);
          } else {
            if (UserUrl.filter === 'greater') {
              console.log('in greater', compareVal, UserUrl.compareVal);
              // pulls first set of numbers from text
              if (text.match(/\d+\.?\d*/gi)) {
                var compareVal = text.match(/\d+\.?\d*/gi)[0];
              }
              if (compareVal > UserUrl.compareVal) {
                cb(oldImg, newImg);
              }
            } else if (UserUrl.filter == 'less') {
              // TODO: pull numeric value from text
              if (text.match(/\d+\.?\d*/gi)) {
                var compareVal = text.match(/\d+\.?\d*/gi)[0];
              }
              if (compareVal < UserUrl.compareVal) {
                cb(oldImg, newImg);
              }
            } else if (UserUrl.filter == 'contains') {
              // if a user wants to check for multiple words
              var contains = UserUrl.compareVal.split(',') || UserUrl.compareVal;
              // iterate through each word
              for (var i = 0; i < contains.length; i++) {
                // if text contains any of the values
                if (text.toLowerCase().indexOf(contains[i].toLowerCase()) > -1) {
                  cb(oldImg, newImg);
                } 
              } 
            }  else {
                  if (UserUrl.cronVal !== text) {
                   cb(oldImg, newImg);
                  } 
            };
          }; 
        }); 
    }); 
  },

  compareScreenShot: function(UserUrl, website, email, params, oldImg, cb) {
    module.exports.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
      // checks for difference in pictures
      compare(oldImg, newImg, function (equal, oldImg, newImg){
        if (!equal){
          cb(oldImg, newImg);
        }; 
      }); 
    });
  },

  sendEmail: function(website, email, oldImg, newImg, sendOption, UserUrl) {
    console.log('change detected on', website, 'sending email to ', email);
    // parameters for email

    // TODO: Add different mail options for different comparison funcitons.
    var mailOptions = {
        greater: {
          from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
          to: email, // list of receivers
          subject: 'We found some tubular changes!', // Subject line
          text: 'Hi there! It looks like we found a change on '+ website + '! Looks like the value you are watching went over ' + UserUrl.compareVal, // plaintext body
          html: "<span>The Scrapinit team found a change on " + website +"!</span>",
          attachments: [
          {
            path: oldImg
          },
          {
            path: newImg
          }
          ]
        },
        less: {
          from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
          to: email, // list of receivers
          subject: 'We found some tubular changes!', // Subject line
          text: 'Hi there! It looks like we found a change on '+ website + '! Looks like the value you are watching went under ' + UserUrl.compareVal, // plaintext body
          html: "<span>The Scrapinit team found a change on " + website +"!</span>",
          attachments: [
          {
            path: oldImg
          },
          {
            path: newImg
          }
          ]
        },
        contains: {
          from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
          to: email, // list of receivers
          subject: 'We found some tubular changes!', // Subject line
          text: 'Hi there! It looks like we found a change on '+ website + '! Looks like the value you are watching contains ' + UserUrl.compareVal, // plaintext body
          html: "<span>The Scrapinit team found a change on " + website +"!</span>",
          attachments: [
          {
            path: oldImg
          },
          {
            path: newImg
          }
          ]
        },
        Text: {
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
        },
        Image: {
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
        }
    };

    // send email function
    transporter.sendMail(mailOptions[sendOption], function(error, info){mailOptions[sendOption]
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }; 
    }); 
  }
}


