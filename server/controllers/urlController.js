var basicScraper = require('./basicScraperController');
var db = require("../db");

module.exports = {
  getUrls: function (req, res, next) {
    console.log('get Urls');
    res.send( db.User.getUrls(req.session.email) );
  },
  postUrl: function (req, res, next) {
    console.log('post Urls');
  },

  getExternalUrl: function(req,res, next){
    var url = req.body.url;
    console.log(req.body.url);
    basicScraper.get(url, function(error, response, html){
      if(!error && response.statusCode === 200){
        console.log('success');
        res.send(html);
      } else {
        console.log('failure');
        res.send("error no response");
      }
    });
  }
};
