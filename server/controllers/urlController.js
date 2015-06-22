var basicScraper = require('./basicScraperController');
var db = require("../db");




module.exports = {
  getUrls: function (req, res, next) {
    console.log('get Urls');

//Testing response
      res.status(201).json({
        urls : [{
          url : 'joedaddy.com',
            whatToWatch : 'thePrize',
            pingRate : '5 min',
            active : 'yes'
          }]
      });



      // db.User.getUrls(user, function(urls){
      //   res.status(201).json({
      //     urls : [{
      //       url : 'joedaddy.com',
      //       whatToWatch : 'thePrize',
      //       pingRate : '5 min',
      //       active : 'yes'
      //     }]
      //   });
      // })
      // .catch(function (err) {
      //   res.status(403).json({message: err.message});
      // });
  },
  addUrl: function (req, res, next, cb) {
    var email = req.session.email;
    var url = req.body;

    db.User.findOne({
      where: {
        email: email
      }
    })
    .then(function (userFound) {
      if (userFound) {
        db.Url.findOne({
          where: url
        })
        .then(function(urlFound) {
          if(urlFound){
            // db.associate(userFound.email, urlFound.url, {html: html, selector: selector})//need to store and send the html & selector
            cb('url found');
          } else {
            db.Url.create(url)
            .then(function (newUrl){
                // db.associate(userFound.email, newUrl.url, {html: html, selector: selector})//need to store and send the html & selector
              cb('url created');
            })
            .catch(function (err) {
              res.status(403).json({message: err.message});
            });
          }
        });
      }
    });

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
