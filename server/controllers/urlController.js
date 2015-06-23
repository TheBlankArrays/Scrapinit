var basicScraper = require('./basicScraperController');
var db = require("../db");




module.exports = {
  getList: function (req, res, next) {
    console.log('get Urls');
    var email = req.session.email;
    var url = req.body;

//Testing response
      // res.status(201).json({
      //   urls : [{
      //     url : 'joedaddy.com',
      //       whatToWatch : 'thePrize',
      //       pingRate : '5 min',
      //       active : 'yes'
      //     }]
      // });
      var urlArr = [];

      db.User.findOne({where: {email: email}})
        .then(function(foundUser) {
          console.log('the foundUser is', foundUser);
          foundUser.getUrls()
            .then(function(urls) {
              for (var i = 0; i < foundUser.length; i++) {
                var urlObj = {};
                urlObj.selector = foundUser[i].selector;
                urlObj.html = foundUser[i].html;
                urlObj.frequency = foundUser[i].frequency;
                urlArr.push(urlObj);
                console.log('the urlArr is now', urlArr);
              }
              console.log('final urlArr is', urlArr);
            })
        })

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
    console.log('in addurl');
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

          this.getExternalUrl(req.body.url, function(html) {
            console.log(html);
            if (html === 'error') {
              res.send('error');
            }

            if(urlFound){
              // need to add in paramaters for html, and selector
              userFound.addUrl(urlFound, {html: html, selector: selector});

              // db.associate(userFound.email, urlFound.url, {html: html, selector: selector})//need to store and send the html & selector
              res.status(201);

              cb('url found');
            } else {
              db.Url.create(url)
              .then(function (newUrl){
              // need to add in paramaters for html, and selector
              userFound.addUrl(newUrl, {html: html, selector: selector});
                cb('url created');
                res.status(201);
              })
              .catch(function (err) {
                res.status(403).json({message: err.message});
              });
            }

          });


        });
      }
    });

},
getExternalUrl: function(url, cb){

  basicScraper.get(url, function(error, response, html){
    if(!error && response.statusCode === 200){
      cb(html);
    } else {
      console.log('failure getting external url');
      cb('error');
    }
  });
}
};
