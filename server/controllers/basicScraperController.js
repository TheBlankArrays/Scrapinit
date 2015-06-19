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
    request(url, function (error, response, html) {
      cb(error, response, html);
    })
  } else {
      cb(true, {statusCode: null}, null);
    }
  }
};


