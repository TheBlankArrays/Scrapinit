var basicScraper = require('./basicScraperController');
var db = require("../db");




module.exports = {
  getList: function (req, res, next) {
    console.log('we are here')
    var email = req.session.email;
    db.User.findOne({
      where: {
        email: email
      },
      attributes: ['email'],
      include: [
        { model: db.UserUrl },
        { model: db.Url }
      ]
    })
    .then(function(urls) {
      if (urls) {
        res.status(200).json(urls);
      }else{
        res.status(500).json({error:'Server error'});
      }
    });
  },
  addUrl: function (req, res, next) {
    console.log('in addurl');
    var email = req.session.email;
    var url = req.body;
    var that = this;
    var selector = 'body';


    db.User.findOne({
      where: {
        email: email
      }
    })
    .then(function (userFound) {
      // console.log(userFound);
      if (userFound) {
        db.Url.findOne({
          where: url
        })
        .then(function(urlFound) {

          that.getExternalUrl(req.body.url, function(html) {
            html = html.substring(0,200);
            console.log(html);
            if (html === 'error') {
              res.send('error');
            }

            if(urlFound){
              // need to add in paramaters for html, and selector
             // console.log('urlFound',urlFound)
           userFound.addUrl(urlFound, {html: html, selector: selector})
          
           userFound.getUrls()
                .then(function(associate){
                  console.log('url found');
                  //console.log('associate'+ JSON.stringify(associate[0]));
                   res.status(201).json({});
                })
                .catch(function(err) {
                  console.log('we found an error', err);
                })
              // db.associate(userFound.email, urlFound.url, {html: html, selector: selector})//need to store and send the html & selector
             

            } else {
              db.Url.create(url)
              .then(function (newUrl){
               // console.log('inside of db.Url.create')
              // need to add in paramaters for html, and selector
              userFound.addUrl(newUrl, {html: html, selector: selector});
                console.log('url created');
                res.status(201).json({});
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
getListOfUrls: function(req, res, next){
  console.log('in getListOfUrls ', req.session.email)
   var email = req.session.email;

   db.User.findOne({
     where: {
       email: email
     }
   }).then(function(userFound) {

     userFound.getUrls()
       .then(function(urlArr) {

         if (urlArr && urlArr[0]) {
           console.log('our url array', urlArr[0].UserUrl);
           res.status(200).json(urlArr);
         } else {
           res.status(200).json({});
         }
       });

   });

 },

getExternalUrl: function(url, cb){
  console.log('url inside of getExternalUrl', url)
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
