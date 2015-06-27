var basicScraper = require('./controllers/basicScraperController');
var getExternalUrl = require('./controllers/urlController').getExternalUrl;
var CronJob = require('cron').CronJob;
var secret = require('../config.js');
var db = require('./db.js');
var Sequelize = require('sequelize');
var mandrill = require('mandrill-api');
mandrill_client = new mandrill.Mandrill(secret.mandrill.client_id);
var compare = require('./imgCompare.js').compare;



module.exports = {
  addCron: function(userObj) {
    // information I need:
    /*
      frequency
      userUrl obj
      user id
      image path name
      url
      parameters
    */

  }
}

// for faster testing
var schedule = '*/5 * * * * *';
//To run every 3 seconds do */3; every 5 min do * */5 *

var cronjob = new CronJob(schedule, function() {
  console.log('You will see this message every 5 min');
  // get urls
  db.User.findAll()
  .then(function(allUsers) {
    for (var i = 0; i < allUsers.length; i++){
      var currEmail = allUsers[i].email;
      console.log('email', currEmail)
      allUsers[i].getUrls()
      .then(function(url) {
        for (var j=0; j<url.length; j++){
          console.log('checking', url[j].url, 'for changes');

           var img1 = url[j].UserUrl.cropImage;
           var params = {
            h: url[j].UserUrl.cropHeight,
            w: url[j].UserUrl.cropWidth,
            x: url[j].UserUrl.cropOriginX,
            y: url[j].UserUrl.cropOriginY
          }
           //console.log('about to call basicScraper')
        // get the server to render the page with params coordinates
        basicScraper.getScreenshot(url[j].url, url[j].id, function(urlToThePage) {
          basicScraper.cropImg(urlToThePage, params, true, function(img2) {
            console.log('old image path', img1);
            console.log('new image path', img2);
          });
        });
        }
      });
    };
  });
}, null, true, 'America/Los_Angeles');

var sendEmail = function (email, name){
  var message = {
    "html": "<span>The Scrapinit found a change in the webpage you are following</span>",
    "subject": "We scraped some tubular stuff for you!!",
    "from_email": email,
    "from_name": "The Blank Arrays",
    "to": [{
      "email": email,
      "name":  name,
      "type": "to"
    },
    ],
    "headers": {
      "Reply-To": ""
    },
    "important": true,
  };

  var async = false;
//send email // uncomment to send an email
mandrill_client.messages.send({"message": message, "async": async}, function(result) {
  console.log('Sent a message to '+ email+'  '+ result);
}, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
          });
}
