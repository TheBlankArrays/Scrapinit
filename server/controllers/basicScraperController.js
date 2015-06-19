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


// obj.get(url, function(error, response, html){
//     if (!error && response.statusCode == 200) {
//       console.log('success');
//       // console.log(html);        
//     } else {
//       console.log('failure')
//       console.log('error -' + error);
//     }
//   }
// );