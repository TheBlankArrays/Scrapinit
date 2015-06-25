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

    var email = req.session.email;
    var url = {url: req.body.url};
    console.log('req body', JSON.stringify(req.body));
    console.log('url up top ' + JSON.stringify(url));
    var that = this;
    var selector = 'body';

    db.User.findOne({
      where: {
        email: email
      }
    })
    .then(function (userFound) {

      if (userFound) {

        // always will be true (hopefully) because they are logged in to access this route
        // current user equals userFound

        console.log('url: ' + JSON.stringify(url));

        db.Url.findOne({
          where: url
        })
        .then(function(urlFound) {
          console.log('req.body.urlImg' + req.body.urlImg);
          console.log('req.body.crop' + JSON.stringify(req.body.crop));

          basicScraper.cropImg(req.body.urlImg, req.body.crop, function(cropImg, crop) {
            // crop image whether or not the url has already been submitted

            if (urlFound) {


               console.log('loggin it yo', JSON.stringify(crop));
               console.log('urlfound: '+ urlFound);

               userFound.addUrl(urlFound, {
                  cropImage: cropImg,
                  cropHeight: crop.h,
                  cropWidth: crop.w,
                  cropOriginX: crop.x,
                  cropOriginY: crop.y
               })
               .then(function(associate) {
                 console.log(associate);
                 res.status(201).json(associate);
               });


              //  userFound.getUrls()
              //       .then(function(associate){
              //         console.log('url found');
              //         //console.log('associate'+ JSON.stringify(associate[0]));
              //          res.status(201).json({});
              //       })
              //       .catch(function(err) {
              //         console.log('we found an error', err);
              //       })
              //     // db.associate(userFound.email, urlFound.url, {html: html, selector: selector})//need to store and send the html & selector


               console.log('url found');;

            } else {  // else !urlFound

              console.log('url not found');

              db.Url.create(url)
                .then(function (urlCreated) {

                  userFound.addUrl(urlCreated, {
                     cropImage: cropImg,
                     cropHeight: crop.h,
                     cropWidth: crop.w,
                     cropOriginX: crop.x,
                     cropOriginY: crop.y
                  })
                  .then(function(associate) {
                    console.log(associate);
                    res.status(201).json(associate);
                  })
                  .catch(function (err) {
                    res.status(403).json({message: err.message});
                  }); // close catch of addurl db call
                })  // close then of create url db call
                .catch(function (err) {
                  res.status(403).json({message: err.message});
                }); // close catch of create url db call

            } // close else urlFound

          }); // close cropImg callback

        }); // close urlFound then

      } // close if userFound

    });  // close userFound then
  }
},

getUrl: function (req, res) {
  var idUrl = req.params.idUrl;
  db.Url.findOne({
    where: {
      id: idUrl
    },
    include: [
      { model: db.UserUrl },
      {
        model: db.UserUrl,
        where: {
          email: req.session.email
        }
      }
    ]
  })
  .then(function (urlFound) {
    if(urlFound) {
      res.status(200).json(urlFound);
    }else {
      res.status(403).json({error: 'You dont have permissions in this URL'});
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
