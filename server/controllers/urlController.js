var basicScraper = require('./basicScraperController');

module.exports = {
  getUrls: function (req, res, next) {
    console.log('get Urls');
  },
  postUrl: function (req, res, next) {
    console.log('post Urls');
  },
  getExternalUrl: function(req,res, next){
    var url = req.body.url;
    basicScraper.get(url, function(error, response, html){
      if(!error & response.statusCode === 200){
        res.send(html);
      } else {
        res.send('error');
      }
    });
  }
};