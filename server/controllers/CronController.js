var basicScraper = require('./basicScraperController');
var getExternalUrl = require('./urlController').getExternalUrl;
var compare = require('../imgCompare.js').compare;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var compareUtils = require('../cron');
var nodemailer = require('nodemailer');
var ocr = require('./ocr');
var secret = require('../../config.js');
var Sequelize = require('sequelize');
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
    //var freq = UserUrl.frequency;

    var action = UserUrl.compare || 'image';

    // hours
    // var freq = '* * */' + UserUrl.frequency + ' * * *';

    // minutes
    // var freq = '* */' + UserUrl.frequency + ' * * * *';

    var freq = '*/5 * * * * *';
    // var freq = '* */5 * * * *';


    console.log('Starting cronJob', key, 'for', UserUrl.url, ' with frequency ', freq);


    if (manager.exists(key)) {
      manager.deleteJob(key);
    };
    manager.add(key, freq, function() {
      if (UserUrl.status) {
        // var currentDate = new Date(dateString);
        // console.log('the date is', currentDate);
        console.log('checking', url, 'for', UserUrl.email);
         var oldImg = UserUrl.cropImage;
         var email = UserUrl.email;
         var params = {
          h: UserUrl.cropHeight,
          w: UserUrl.cropWidth,
          x: UserUrl.cropOriginX,
          y: UserUrl.cropOriginY
        };

        UserUrl.lastScrape = compareUtils.getDate();

        console.log(key, 'last checked at', UserUrl.lastScrape);

        if (UserUrl.comparison === 'text') {
          compareUtils.compareOCR(UserUrl, url, email, params, oldImg, function(oldImg, newImg) {
            // if we enter the anonymous function, we can assume images are not equal
            if (!UserUrl.continueAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            }
            // if images are not equal, send an email
            compareUtils.sendEmail(url, email, oldImg, newImg);
          });
        } else if (UserUrl.comparison === 'image') {
          compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg, function(oldImg, newImg) {
            // if we enter the anonymous function, we can assume images are not equal
            if (!UserUrl.continueAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            }
            // if images are not equal, send an email
            compareUtils.sendEmail(url, email, oldImg, newImg);
          });

        } else {
          compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg, function(oldImg, newImg) {
            // if we enter the anonymous function, we can assume images are not equal
            if (!UserUrl.continueAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            }
            // if images are not equal, send an email
            compareUtils.sendEmail(url, email, oldImg, newImg);
          });
        }
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
