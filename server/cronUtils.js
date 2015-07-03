var basicScraper = require('./controllers/basicScraperController');
var getExternalUrl = require('./controllers/urlController').getExternalUrl;
var compare = require('./imgCompare').compare;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var nodemailer = require('nodemailer');
var ocr = require('./controllers/ocr');
var secret = require('../config.js');
var Sequelize = require('sequelize');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});

module.exports = {
  getNewCroppedImage: function(UserUrl, website, email, params, oldImg, cb) {
    basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
      // crops new image so we can compare the the old cropped image
      basicScraper.cropImg(img1, params, true, function(newImg) {
        // checks for difference in pictures
        console.log('img1 in cropImg', img1);
        cb(oldImg, newImg)
      }); // basicScraper.cropImg(img1, params, true, function(img2) {
    }, email); // basicScraper.getScreenshot()
  },

  compareOCR: function(UserUrl, website, email, params, oldImg) {
    // TODO: take values that are input to it, pass it through compare ocr functions? Should be in basicScroperController?
    this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
        ocr.converImageToText(newImg, function(err, text) {
          if (err) {
            console.log('ocr error' + err);
          } else {
            console.log('comparing text values');
            if (UserUrl.cronVal !== text) {
              console.log("WE FOUND A DIFFERENCE IN TEXT!");
              this.sendEmail(website, email, oldImg, newImg);
            } // if (UserUrl.cronVal !== text) {
          } // } else {
        }); // ocr.converImageToText(newImg, function(newImg) {
    }); //this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
  },

  compareScreenShot: function(UserUrl, website, email, params, oldImg) {
    this.getNewCroppedImage(UserUrl, website, email, params, oldImg, function(oldImg, newImg) {
      // checks for difference in pictures
      compare(oldImg, newImg, function (equal, oldImg, newImg){
        if (!equal){
          // set status to false since we are stopping the cronjob
          UserUrl.status = false;
          // stop cronjob
          this.stopCron(UserUrl.user_id, UserUrl.url_id)
          // if images are not equal, send an email
          this.sendEmail(website, email, oldImg, newImg);
        }; // if (!equal){
      }); // compare(img1, img2, function (equal){
    });
  },

  sendEmail: function(website, email, oldImg, newImg) {
    console.log('change detected on', website, 'sending email to ', email);
    // parameters for email
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
    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //       console.log(error);
    //     } else {
    //       console.log('Message sent: ' + info.response);            
    //     }; // else statemenet  
    // }); // transporter.sendMail(mailOptions, function(error, info){
  } // sendEmail: function(website, email) {
}


