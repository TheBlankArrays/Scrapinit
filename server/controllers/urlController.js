var basicScraper = require('./basicScraperController');

module.exports = {
  getUrls: function (req, res, next) {
    console.log('get Urls');
    res.send('you are checking out ' + req.body.url);
  },
  postUrl: function (req, res, next) {
    console.log('post Urls');
  }
  /**
    * Feature: return the html from the page
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
  **/
};
