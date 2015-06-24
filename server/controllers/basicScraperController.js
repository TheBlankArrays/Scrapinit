var request = require('request');
var validator = require('validator');
var webshot = require('webshot');


var validProtocols = {
  'http': 'true',
  'https': 'true'
}

module.exports = {
  get: function(url, cb){
    var protocolIdentifier = url.split('://');
    if (validProtocols[protocolIdentifier[0]]){
      console.log('passed valid protocol');
      request(url, function (error, response, html) {
        cb(error, response, html);
      })
    } else {
        console.log('failed protocol');
        cb(true, {statusCode: null}, null);
    }
  },
  getScreenshot: function(url, userId, cb) {

    var urlWithoutHTTP = url.substr(7);
    webshot(req.body.url, '../client/assets/' + userId + '/' + urlWithoutHTTP + '.jpg', function(err) {
      // screenshot now saved to google.png// screenshot now saved to hello_world.png
      cb('assets/' + userId + '/' + urlWithoutHTTP + '.jpg');
    });
  }
};
