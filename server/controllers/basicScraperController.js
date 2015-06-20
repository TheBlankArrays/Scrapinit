var request = require('request');
var validator = require('validator');
var validProtocols = {
  'http': 'true',
  'https': 'true'
}

module.exports = {
  get: function(url, cb){
  var protocolIdentifier = url.split('://');
  if(validProtocols[protocolIdentifier[0]]){
    console.log('passed valid protocol');
    request(url, function (error, response, html) {
      cb(error, response, html);
    })
  } else {
      console.log('failed protocol');
      cb(true, {statusCode: null}, null);
    }
  }
};


