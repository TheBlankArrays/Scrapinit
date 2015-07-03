var basicScraper = require('./basicScraperController');
var getExternalUrl = require('./urlController').getExternalUrl;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var secret = require('../../config.js');
var db = require('../db.js');
var Sequelize = require('sequelize');
var compare = require('../imgCompare.js').compare;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});


var manager = new CronJobManager();

module.exports = {
  startAllCron: function() {
    console.log('starting all cronjobs');
    db.User.findAll()
    .then(function(allUsers) {
      for (var i = 0; i < allUsers.length; i++){
        allUsers[i].getUrls()
        .then(function(url) {
          for (var j=0; j<url.length; j++){
             var userUrl = url[j].UserUrl;
             var active = userUrl.status;
             var url = url[j].url;
             if (active) {
               console.log('watching ' + url + ' for ' + userUrl.email)
               module.exports.addCron(userUrl, url);
             }; // if (active)
          }; // for loop iterating over each url for a user
        }); // .then(function(url){
      }; // or (var i = 0; i < allUsers.length; i++){
    }); // .then(function(allUsers) {
  },

  addCron: function(UserUrl, url) {
    UserUrl.status = true;
    var userUrl = UserUrl;
    var key = UserUrl.url_id.toString() + UserUrl.user_id.toString();
    console.log('Starting cronJob', key);
    var action = UserUrl.compare || 'image';

    // hours
    // var freq = '* * */' + UserUrl.frequency + ' * * *';

    // minutes
    // var freq = '* */' + UserUrl.frequency + ' * * * *';

    var freq = '* * * 1 * *';

    // FOR TEST PURPOSES ONLY seconds
    // var freq = '*/' + UserUrl.frequency + ' * * * * *';

    if (manager.exists(key)) {
      manager.deleteJob(key);
    };
    manager.add(key, freq, function() {
      if (UserUrl.status) {
        console.log('checking', url, 'for', UserUrl.email);
         var oldImg = UserUrl.cropImage;
         var email = UserUrl.email;
         var params = {
          h: UserUrl.cropHeight,
          w: UserUrl.cropWidth,
          x: UserUrl.cropOriginX,
          y: UserUrl.cropOriginY
        };

        // TODO: 
        // check userUrl if comparing screenshot or ocr values?
        // if (UserUrl.) {
          // compareUtils.compareOCR(value, value, value);
        // }
        // compares screenshot, sends email if there is a difference in image

        compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg);
      } else {
        manager.stop()
      }
    });
    manager.start(key);
  },

  startCron: function(user_id, url_id) {
    var key = url_id.toString() + user_id.toString();
    if (manager.exists(key)) {
      console.log('Starting cronjob', key);
      manager.start(key);
    } else {
      console.log('error, cronjob', key, ' does not exist');
    }
  },

  stopCron: function(user_id, url_id) {
    var key = url_id.toString() + user_id.toString();
    console.log('Stopping cronJob', key);
    manager.stop(key);
  },

  deleteCron: function(user_id, url_id) {
    var key = url_id.toString() + user_id.toString();
    console.log('Deleting cronJob', key);
    manager.deleteJob(key);
  },
};

var compareUtils = {
  compareOCR: function() {
    // TODO: take values that are input to it, pass it through compare ocr functions? Should be in basicScroperController?
  },

  compareScreenShot: function(UserUrl, website, email, params, oldImg) {
    // gets screenshot of website
    basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
      // crops new image so we can compare the the old cropped image
      basicScraper.cropImg(img1, params, true, function(newImg) {
        // checks for difference in pictures
        console.log('img1 in cropImg', img1);
        compare(oldImg, newImg, function (equal, oldImg, newImg){
          if (!equal){
            // set status to false since we are stopping the cronjob
            UserUrl.status = false;
            // stop cronjob
            module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            // if images are not equal, send an email
            compareUtils.sendEmail(website, email, oldImg, newImg);
          }; // if (!equal){
        }); // compare(img1, img2, function (equal){
      }); // basicScraper.cropImg(img1, params, true, function(img2) {
    }, email); // basicScraper.getScreenshot()
  }, // compareScreenShot: function(UserUrl, website, email, params, oldImg) {

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


