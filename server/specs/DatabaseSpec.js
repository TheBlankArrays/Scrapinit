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
            notAUser.should.equal(null);
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
              newUser.addUrl(newUrl)
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

    it('should have a default frequency of 5', function (done) {
      User.create(utils.user)
        .then(function(newUser) {
          Url.create(utils.url)
            .then(function(newUrl) {
              newUser.addUrl(newUrl)
                .then(function(association) {
                  newUser.getUrls()
                    .then(function(urlArr) {
                      urlArr[0].UserUrl.frequency.should.equal(5);
                      done();
                    });
                });
            });
        });
    });

    it('should create an association with given parameters', function (done) {
      User.create(utils.user)
        .then(function(newUser) {
          Url.create(utils.url)
            .then(function(newUrl) {
              newUser.addUrl(newUrl, utils.parameters)
                .then(function(association) {
                  newUser.getUrls()
                    .then(function(urlArr) {
                      urlArr[0].UserUrl.cropImage.should.equal(utils.parameters.cropImage);
                      done();
                    });
                });
            });
        });
    });

    it('should update association parameters', function (done) {
      User.create(utils.user)
        .then(function(newUser) {
          Url.create(utils.url)
            .then(function(newUrl) {
              newUser.addUrl(newUrl, utils.parameters)
                .then(function(association) {
                  newUser.getUrls()
                    .then(function(urlArr) {
                      newUser.addUrl(newUrl, utils.parameters2)
                        .then(function(newAssociation) {
                          newUser.getUrls()
                            .then(function(newUrlArr) {
                              newUrlArr[0].UserUrl.cropImage.should.equal(utils.joinParameters.cropImage);
                              newUrlArr[0].UserUrl.cropHeight.should.equal(utils.joinParameters.cropHeight);
                              done()
                            });
                        });
                    });
                });
            });
        });
    });

  });
});



