var request = require('request');
var validator = require('validator');
var validProtocols = {
  'http': 'true',
  'https': 'true'
}

var obj = {
  get: function(url, cb){
  var protocolIdentifier = url.split('://');
  if(validProtocols[protocolIdentifier[0]]){
    request(url, function (error, response, html) {
      cb(error, response, html);
    })
  } else {
      cb('invalid url', null, null);
    }
  }
};

module.exports = obj;

