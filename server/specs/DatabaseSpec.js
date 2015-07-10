var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');

var utils = {
  user: {
    email: "testemail@gmail.com",
    password: "123abc"
  },

  parameters: {
    webImage: 'imageLocation1',
    cropImage: 'imageLocation2',
    cropHeight: 100,
    cropWidth: 200,
    cropOriginX: 50,
    cropOriginY: 60
  },

  assoc: {
    cropImage: 'image',
    numScrapes: 2,
    cropHeight: 10,
    cropOriginX: 10,
    cropOriginY: 10,
    cropWidth: 10,
    email: 'email@dot.com',
    frequency: '5 min',
    ocrText: 'text',
    status: true,
    stopAfterChange: true
  },

  parameters2: {
    webImage: 'imageLocation12',
    cropImage: 'imageLocation22',
    cropWidth: 2002,
    cropOriginX: 502,
    cropOriginY: 602
  },

  joinParameters: {
    webImage: 'imageLocation12',
    cropImage: 'imageLocation22',
    cropHeight: 100,
    cropWidth: 2002,
    cropOriginX: 502,
    cropOriginY: 602
  },

  url: {
    url:'http://www.test.com',
  },

  destroyUrl: function (schema, credentials, callback) {
    schema.find({where: {url: this.url.url}})
      .then(function (foundUrl) {
        if (foundUrl) {
          foundUrl.destroy().then(function() {
            callback();
          });
        }
        else {
          callback();
        }
      });
  },

  destroyUser: function (schema, credentials, callback) {
    schema.find({where: {email: this.user.email}})
    .then(function(foundUser) {
      if (foundUser) {
        foundUser.destroy().then(function() {
          callback();
        });
      }
      else {
        callback();
      }
    });
  }
}

describe('database', function () {
  var sequelize = db.connect('../db/db.sqlite');
  var schemas = db.createSchemas(sequelize, false);
  var User = schemas.User;
  var Url = schemas.Url; 

  afterEach(function (done) {
    utils.destroyUser(User, utils.user, function () {
      utils.destroyUrl(Url, utils.url, function () {
        done();
      });
    });
  });

  describe('database user', function () {

    it('should add user to db', function (done) {
      User.create(utils.user)
        .then(function (newUser) {
          newUser.email.should.equal('testemail@gmail.com');
          done();
        });
    });

    it('should not find a user that doesn\'t exist', function(done) {
      User.find(utils.user)
        .then(function(notAUser) {
          if (notAUser) {
            notAUser.isNewRecord.should.equal(false);
          }
          done()
        });
    });

  });

  describe ('database url', function () {

    it('should add url to db', function (done) {
      Url.create(utils.url)
        .then(function (newUrl) {
          newUrl.url.should.equal('http://www.test.com');
          done(); 
        });
    });


    it('should not find a url that doesn\'t exist', function(done) {
      Url.find(utils.url)
        .then(function(notAUrl) {
          if (notAUrl) {
            notAUrl.should.equal(null);
          }
          done();
        });
    });

  });

  describe ('associations', function () {

    it('should create an association user to url', function (done) {
      User.create(utils.user)
        .then(function (newUser) {
          Url.create(utils.url)
            .then(function (newUrl) {
              newUser.addUrl(newUrl, utils.assoc)
                .then(function (association) {
                  newUser.hasUrls(newUrl)
                    .then(function (result) {
                      result.should.equal(true);
                      done();
                    })
                });
            });
        });
    });

    it('should dont create an association user to url without associations', function (done) {
      User.create(utils.user)
        .then(function (newUser) {
          Url.create(utils.url)
            .then(function (newUrl) {
              newUser.addUrl(newUrl)
                .catch(function (err) {
                  done();
                });
            });
        });
    });

    it('should not create an association when the association had been created before', function (done) {
      User.create(utils.user)
        .then(function (newUser) {
          Url.create(utils.url)
            .then(function (newUrl) {
              newUser.addUrl(newUrl, utils.assoc)
                .then(function (association) {
                  newUser.addUrl(newUrl, utils.assoc)
                    .then(function (association2) {
                      newUser.getUrls()
                        .then(function (urlArr) {
                          urlArr.length.should.equal(1);
                          done();
                        });
                    });
                });
            });
        });
    });



    // Now we can set the frequency from app
    // it('should have a default frequency of 5', function (done) {
    //   User.create(utils.user)
    //     .then(function(newUser) {
    //       Url.create(utils.url)
    //         .then(function(newUrl) {
    //           newUser.addUrl(newUrl)
    //             .then(function(association) {
    //               newUser.getUrls()
    //                 .then(function(urlArr) {
    //                   urlArr[0].UserUrl.frequency.should.equal(5);
    //                   done();
    //                 });
    //             });
    //         });
    //     });
    // });

    // Now is required the association parameters (check the first test of the assocciations)
    // it('should create an association with given parameters', function (done) {
    //   User.create(utils.user)
    //     .then(function(newUser) {
    //       Url.create(utils.url)
    //         .then(function(newUrl) {
    //           newUser.addUrl(newUrl, utils.assoc)
    //             .then(function(association) {
    //               newUser.getUrls()
    //                 .then(function(urlArr) {
    //                   urlArr[0].UserUrl.cropImage.should.equal(utils.assoc.cropImage);
    //                   done();
    //                 });
    //             });
    //         });
    //     });
    // });

  });
});



