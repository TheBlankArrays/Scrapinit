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
             }
          } // for loop iterating over each url for a user
        }); // .then(function(url){
      }; // or (var i = 0; i < allUsers.length; i++){
    }); // .then(function(allUsers) {
  },

  addCron: function(UserUrl, url) {
    var userUrl = UserUrl;
    var key = UserUrl.url_id.toString() + UserUrl.user_id.toString();
    console.log('Starting cronJob', key);
    var action = UserUrl.compare || 'image';

    // hours
    // var freq = '* * */' + UserUrl.frequency + ' * * *';

    // minutes
    // var freq = '* */' + UserUrl.frequency + ' * * * *';

    // TEST every 10 seconds
    // var freq = '*/10 * * * * *';

    // seconds
    var freq = '*/' + UserUrl.frequency + ' * * * * *';

    manager.add(key, freq, function() {
      console.log('checking', url, 'for', UserUrl.email);
       var oldImg = UserUrl.cropImage;
       var email = UserUrl.email;
       var params = {
        h: UserUrl.cropHeight,
        w: UserUrl.cropWidth,
        x: UserUrl.cropOriginX,
        y: UserUrl.cropOriginY
      }

      // compares screenshot, sends email if there is a difference in image
      compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg);

    });

    manager.start(key);

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

}

var compareUtils = {

  compareScreenShot: function(UserUrl, website, email, params, oldImg) {
    // gets screenshot of website
    basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
      // crops new image so we can compare the the old cropped image
      basicScraper.cropImg(img1, params, true, function(newImg) {
        // checks for difference in pictures
        compare(oldImg, newImg, function (equal){
          if (!equal){
            // if images are not equal, send an email
            compareUtils.sendEmail(website, email);
          }; // if (!equal){
        }) // compare(img1, img2, function (equal){
      }); // basicScraper.cropImg(img1, params, true, function(img2) {
    }, email); // basicScraper.getScreenshot()
  },

  sendEmail: function(website, email) {
    console.log('change detected on', website, 'sending email to ', email);

    // parameters for email
    var mailOptions = {
        from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
        to: email, // list of receivers
        subject: 'We found some tubular changes!', // Subject line
        text: 'Hi there! It looks like we found a change on '+ website + '!', // plaintext body
        html: "<span>The Scrapinit team found a change on " + website +"!</span>",
    };

    // Send email function
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        } // else statemenet  
    }); // transporter.sendMail(mailOptions, function(error, info){
  }

}


