var basicScraper = require('./basicScraperController');
var cronjob = require('./cronController');
var db = require("../db");
var ocr = require('./ocr');



module.exports = {
  getList: function (req, res, next) {
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

  checkParametersAddUrl: function (req, res, next) {
    var params = req.body;
    if (!params.url || !params.urlImg || !params.crop || !params.crop.x ||
      !params.crop.y || !params.crop.w || !params.crop.h){
      res.status(400).json({error: 'Need more data'});
    }
    next();
  },

  addUrl: function (req, res, next) {
    console.log('in addUrl ', Object.keys(req.body));
    var email = req.session.email;
    var url = {url: req.body.url};
    var frequency = req.body.freq;
    var urlType = req.body.urlType;


    console.log('req body', JSON.stringify(req.body));
    console.log('url up top ' + JSON.stringify(url));
    console.log('frequency: ' + frequency + ' and type: ' + urlType);
    var that = this;
    var selector = 'body';
    var path =  __dirname + '/../../client/';

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
          basicScraper.cropImg(req.body.urlImg, req.body.crop, false, function(cropImg, crop) {
            // crop image whether or not the url has already been submitted
            console.log('***** urlImg',req.body.urlImg )
            if (urlFound) {

               console.log('loggin it yo', JSON.stringify(crop));
               console.log('urlfound: '+ urlFound);
               console.log('crop path' + cropImg);

               ocr.convertImageToText(path + cropImg, function(err, text){
                  if(err){
                    console.log('ocr ' + err);
                    res.status(400).json({message: err});
                  } else {
                    console.log('ocr text ' + text, ' and frequency ' + frequency + ' and comparison ' + urlType);
                           userFound.addUrl(urlFound, {
                              email: userFound.email,
                              cropImage: cropImg,
                              cropHeight: crop.h,
                              cropWidth: crop.w,
                              cropOriginX: crop.x,
                              cropOriginY: crop.y,
                              status: true,
                              comparison: urlType,
                              ocrText: text,
                              frequency: frequency
                           })
                           .then(function(associate) {
                            db.Url.findOne({
                              where: {
                                id: urlFound.id
                              },
                              include: [
                                {
                                  model: db.UserUrl,
                                  where: {
                                    user_id: req.session.user_id
                                  }
                                }
                              ]
                            }).then(function (userUrl){
                              var response = {
                                url: userUrl.url,
                                id: userUrl.id,
                                UserUrl: userUrl.UserUrls[0],
                              }
                              console.log('sending ' + userUrl.url + ' to cronjob');
                              cronjob.addCron(userUrl.UserUrls[0], userUrl.url);
                              res.status(201).json(response);
                            });
                           })
                           .catch(function (err) {
                            res.status(400).json({message: err.message});
                          });

                  }

               });

            } else {  // else !urlFound

              console.log('url not found');

              db.Url.create(url)
              .then(function (urlCreated) {

                console.log('crop path -' + cropImg);
                ocr.convertImageToText(path + cropImg, function(err, text){
                  if(err){
                    console.log('ocr ' + err);
                    res.status(400).json({message: err});
                  } else {
                    console.log('ocr text ' + text, ' and frequency ' + frequency + ' and comparison ' + urlType);
                    userFound.addUrl(urlCreated, {
                       email: userFound.email,
                       cropImage: cropImg,
                       cropHeight: crop.h,
                       cropWidth: crop.w,
                       cropOriginX: crop.x,
                       cropOriginY: crop.y,
                       status: true,
                       comparison: urlType,
                       ocrText: text,
                       frequency: frequency
                    })
                    .then(function(associate) {
                      db.Url.findOne({
                        where: {
                          id: urlCreated.id
                        },
                        include: [
                          {
                            model: db.UserUrl,
                            where: {
                              user_id: req.session.user_id
                            }
                          }
                        ]
                      }).then(function (userUrl){
                        console.log("we have access to the userUrl", userUrl.url)
                        var response = {
                          url: userUrl.url,
                          id: userUrl.id,
                          UserUrl: userUrl.UserUrls[0]
                        }
                        console.log('sending ' + userUrl.url + ' to cronjob');
                        console.log('with a status of', userUrl.status);
                        cronjob.addCron(userUrl.UserUrls[0], userUrl.url);
                        res.status(201).json(response);
                      });
                    })
                    .catch(function (err) {
                      res.status(400).json({message: err.message});
                    }); // close catch of addurl db call
                  }
                });

              })  // close then of create url db call
              .catch(function (err) {
                res.status(400).json({message: err.message});
              }); // close catch of create url db call


            }; // close image to text callback

          }); // close cropImg callback

        }); // close urlFound then

      } // close if userFound

    });  // close userFound then
  },

  getUrl: function (req, res) {
    var idUrl = req.params.idUrl;
    db.User.findOne({
      where: {
        email: req.session.email
      },
      attributes: ['email'],
      include: [
        {
          model: db.Url,
          where: {
            id: idUrl
          }
        }
      ]
    })
    .then(function (userFound) {
      //object return {email: .., urls: []}
      //return the first element in the userFound.urls
      if(userFound) {
        res.status(200).json(userFound.urls[0]);
      }else {
        res.status(403).json({error: 'You dont have permissions in this URL'});
      }
    });
  },
  removeUrl: function(req, res, next) {
      var email = req.session.email;
      var url = {url: req.body.url};

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
            if (urlFound) {

              console.log('del cron', cronjob.deleteCron);
              cronjob.deleteCron(userFound.id, urlFound.id);
              userFound.removeUrl(urlFound);
              res.status(200).send(true);

            } else {

              res.status(403).json({});

            } // end urlFound
          }); // end url.findOne then

        } // end if userFound
      }); // end user.findOne then

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

 }

};
