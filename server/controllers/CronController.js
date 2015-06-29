var basicScraper = require('./basicScraperController');
var getExternalUrl = require('./urlController').getExternalUrl;
var CronJob = require('cron').CronJob;
var CronJobManager = require('crontab_manager');
var secret = require('../../config.js');
var db = require('../db.js');
var Sequelize = require('sequelize');
var compare = require('../imgCompare.js').compare;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: secret.auth
});


// var CronJob = require('cron').CronJob;

module.exports = {
  addCron: function(UserUrl, url) {
    var userUrl = UserUrl;

    // minutes
    var freq = '* */' + UserUrl.frequency + ' * * * *';

    // TEST every 10 seconds
    // var freq = '*/10 * * * * *';

    // seconds
    // var freq = '*/' + UserUrl.frequency + ' * * * * *';
    
    var job = new CronJob({
      cronTime: freq,
      onTick: function() {
        console.log('checking', url, 'for changes');
         var oldImg = UserUrl.cropImage;
         var email = UserUrl.email;
         var website = url
         var params = {
          h: UserUrl.cropHeight,
          w: UserUrl.cropWidth,
          x: UserUrl.cropOriginX,
          y: UserUrl.cropOriginY
        }

        // get the server to render the page with params coordinates
        basicScraper.getScreenshot(website, UserUrl.user_id, function(img1, email) {
          basicScraper.cropImg(img1, params, true, function(newImg) {
            console.log('old image path', oldImg);
            console.log('new image path', newImg);


            compare(oldImg, newImg, function (equal){

              if (!equal){

                console.log('change detected on', website, 'sending email to ', email);

                var mailOptions = {
                    from: "The Blank Arrays <postmaster@sandbox72a87403dd654630bfa3c4b021cda08d.mailgun.org>", // sender address
                    // currently accessing only one user email
                    to: email, // list of receivers
                    subject: 'We found some tubular changes!', // Subject line
                    text: 'Hi there! It looks like we found a change on '+ website + '!', // plaintext body
                    html: "<span>The Scrapinit team found a change on " + website +"!</span>",
                        // html: '<b>Hello world </b>' // html body
                };

                // Send email function
                // transporter.sendMail(mailOptions, function(error, info){
                //     if(error){
                //         console.log(error);
                //     }else{
                //         console.log('Message sent: ' + info.response);
                //     } //  else statemenet  
                // }); //  transporter.sendMail(mailOptions, function(error, info){
              }; // if (!equal){
            }) // compare(img1, img2, function (equal){
          }); // basicScraper.cropImg(img1, params, true, function(img2) {
        }, email); // basicScraper.getScreenshot()
      },
      start: false,
      timeZone: "America/Los_Angeles"
    });
    job.start();
  }
}


