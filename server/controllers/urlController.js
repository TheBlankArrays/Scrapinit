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
            console.log('***** urlImg',req.body.urlImg )
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
};
