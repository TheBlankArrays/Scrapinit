var compare = require('../imgCompare.js').compare;
var CronJob = require('cron').CronJob;
var CronJobManager = require('cron-job-manager');
var db = require('../db');
var compareUtils = require('../utils/cron');
var nodemailer = require('nodemailer');
var fs = require('fs');
var ocr = require('./ocrController.js');
var secret = require('../../config.js');
var Sequelize = require('sequelize');
var manager = new CronJobManager();

module.exports = {

  startAllCron: function() {
    console.log('starting all cronjobs');
    db.User.findAll()
    .then(function(allUsers) {
      for (var i = 0; i < allUsers.length; i++) {
        allUsers[i].getUrls()
        .then(function(url) {
          for (var j=0; j<url.length; j++) {
             var userUrl = url[j].UserUrl;

             module.exports.startCron(userUrl.user_id, userUrl.url_id);
             // var active = userUrl.status;
             // var url = url[j].url;
             // if (active) {
             //   console.log('watching ' + url + ' for ' + userUrl.email)
             //   module.exports.addCron(userUrl, url);
             // }; // if (active)
          }; // for loop iterating over each url for a user
        }); // .then(function(url){
      }; // or (var i = 0; i < allUsers.length; i++){
    }); // .then(function(allUsers) {
  },

  addCron: function(UserUrl, url) {

    UserUrl.status = true;

    var key = UserUrl.url_id.toString() + UserUrl.user_id.toString();
    var freq = UserUrl.frequency;
    var action = UserUrl.compare || 'Image';

    console.log('Starting cronJob', key, 'for', url, ' with frequency ', freq);

    if (manager.exists(key)) {
      manager.deleteJob(key);
    };

    manager.add(key, freq, function() {
      if (UserUrl.status) {
        UserUrl.lastScrape = compareUtils.getDate();

         var oldImg = UserUrl.cropImage;
         var email = UserUrl.email;
         var params = {
          h: UserUrl.cropHeight,
          w: UserUrl.cropWidth,
          x: UserUrl.cropOriginX,
          y: UserUrl.cropOriginY
        };

         UserUrl.lastScrape = compareUtils.getDate();

        var sendOption = UserUrl.filter === 'null' ? UserUrl.comparison : UserUrl.filter;

        if (UserUrl.comparison === 'Text') {
          compareUtils.compareOCR(UserUrl, url, email, params, oldImg, function(oldImg, newImg, newVal) {
            // if images are not equal, send an email
            
            // if we enter the anonymous function, we can assume images are not equal
            if (UserUrl.stopAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            } else {
              // update image and value
              UserUrl.updateAttributes({
                ocrText: newVal
              })
              fs.rename(newImg, oldImg, function(err) {
                if (err) {
                  console.log('ERROR:', err);
                }
              })
            }
            compareUtils.sendEmail(url, email, oldImg, newImg, sendOption, UserUrl);
          });
        } else if (UserUrl.comparison === 'Image') {
          compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg, function(oldImg, newImg) {
            // if we enter the anonymous function, we can assume images are not equal
            if (UserUrl.stopAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            } else {
            compareUtils.sendEmail(url, email, oldImg, newImg, sendOption, UserUrl);
              // update image
              fs.rename(newImg, oldImg, function(err) {
                if (err) {
                  console.log('ERROR:', err);
                }
              })
            }
            // if images are not equal, send an email
          });

        } else {
          compareUtils.compareScreenShot(UserUrl, url, email, params, oldImg, function(oldImg, newImg) {
            // if we enter the anonymous function, we can assume images are not equal
            if (UserUrl.stopAfterChange) {
              // set status to false since we are stopping the cronjob
              UserUrl.status = false;
              // stop cronjob
              module.exports.stopCron(UserUrl.user_id, UserUrl.url_id)
            } else {
            compareUtils.sendEmail(url, email, oldImg, newImg, sendOption, UserUrl);
              // update image
              fs.rename(oldImg, newImg, function(err) {
                if (err) {
                  console.log('ERROR:', err);
                }
              })
            }
            // if images are not equal, send an email
          });
        }

        UserUrl.numScrapes++;

        if (UserUrl.numScrapes >= 100) {

          db.User.findOne({
            where: {
              email: UserUrl.email
            }
          })
          .then(function (userFound) {

            if (userFound) {

              db.Url.findOne({
                where: UserUrl.url
              })
              .then(function(urlFound) {
                if (urlFound) {
                  var key = UserUrl.user_id.toString() + UserUrl.url_id.toString()
                  userFound.removeUrl(urlFound);
                  manager.deleteJob(key);
                  console.log('cronJob', key, 'stopped!')
                } else {

                  console.log('error. Url not found in cronController')
                } 
              }); 
            } 
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
