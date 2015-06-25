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
        {
          model: db.Url
        }
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
    var url = {url: req.body.url};
    var that = this;
    var selector = 'body';


        console.log('email: ' +email);

        db.User.findOne({
          where: {
            email: email
          }
        })
        .then(function (userFound) {
           console.log(userFound);
          if (userFound) {
            console.log('URL!!!!!' + url);
            db.Url.findOne({
              where: url
            })
            .then(function(urlFound) {
              console.log('in the then');
              basicScraper.cropImg(req.body.urlImg, req.body.crop, function(cropImg, crop) {

                if(urlFound){
                  // need to add in paramaters for html, and selector
                 // console.log('urlFound',urlFound)

                 console.log('loggin it yo', that.req.body.crop.x);
                 console.log('urlfound: '+ urlFound);
                 userFound.addUrl(urlFound, {
                    cropImage: cropImg,
                    cropHeight: 23,
                    cropWidth: 41,
                    cropOriginX: 23,
                    cropOriginY: 232
                 })

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
                      userFound.addUrl(urlFound, {
                         cropImage: cropImg,
                         cropHeight: 23,
                         cropWidth: 41,
                         cropOriginX: 23,
                         cropOriginY: 232
                      })
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
      // console.log('url inside of getExternalUrl', url)
      basicScraper.get(url.url, function(error, response, html){
        if(!error && response.statusCode === 200){
          cb(html, url);
        } else {
          console.log('failure getting external url', url);
          cb('error');
        }
      });
    }
};
