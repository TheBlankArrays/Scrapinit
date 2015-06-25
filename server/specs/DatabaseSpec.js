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
    cropOriginY: 60,
  },

  url: {
    url:'http://www.test.com',
  },

  destroyUrl: function (schema, credentials, callback) {
    schema.find({where: {url: this.url}})
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
  });

  describe ('database url', function () {

    it('should add url to db', function (done) {
      Url.create(utils.url)
        .then(function (newUrl) {
          newUrl.url.should.equal('http://www.test.com');
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
                  newUser.getUrls()
                    .then(function(urlArr) {
                      urlArr[0].url.should.equal(utils.url.url);
                      done();
                    })
                //   newUser.hasUrls(newUrl)
                //     .then(function (result) {
                //       result.should.equal(true);
                //       done();
                //     })
                })
            })
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
                    })
                })
            })
        })
    })

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
                    })
                })
            })
        })
    })

  });
});



