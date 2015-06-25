/* server must be running when you executes the tests 
  run the test with "mocha apiSpecs.js" */
var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');
var bcrypt = require('bcrypt');
var utils = {
  testUser: {
    email: "testemail@gmail.com",
    password: '123qwe'
  },

  createAgent: function(server) {
    var server = server || serverHost
    return supertest.agent(server);
  },

  signUpUser: function (credentials, callback) {
    request.post('/api/users/signup')
    .send(credentials)
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          callback();
        }
      }
    });
  },

  destroyUser: function (schema, credentials, callback) {
    schema.find({where: {email: this.testUser.email}})
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
  },

  logInAgent: function (agent, credentials, callback) {
    agent.post('/api/users/login')
    .send(credentials)
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          //user object can be accessed in callback
          callback(res.body);
        }
      }
    });
  },

  logOutAgent: function (agent, callback) {
    agent.get('/api/users/logout')
    .end(function(err, res) {
      if (callback) {
        if (err) {
          callback(err);
        }
        else {
          callback();
        }
      }
    });
  }
};

describe('URL LIST', function () {
  var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;
  var Url = schemas.Url;
  var UserUrl = schemas.UserUrl;

  before(function (done) {
    utils.signUpUser(utils.testUser, function (err) {
      done();
    });
  });

  //deletes inserted user from database after all tests are complete
  after(function (done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });

  describe('URLS', function () {

    describe('Route /api/users/list', function () {

      it('should return 401 when there are not a user logged and try request', function (done) {
        request.get('/api/users/list')
        .expect(401)
        .end(function (err, res) {
          done();
        });
      });

      it('should return 401 when user just logged out and try request', function (done) {
        var agent = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          utils.logOutAgent(agent, function () {
            request.get('/api/users/list')
            .expect(401)
            .end(function (err, res) {
              done();
            });
          });
        });
      });

      it('should return 200 when there are a user logged and try request', function (done) {
        var agent = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          Url.create({url: 'http://www.google.com'})
          .then(function (newUrl){
            UserUrl.create({
              user_id: user.id,
              url_id: newUrl.id,
              selector: 'Selector',
              webImage: 'path to image',
              cropHeight: 10,
              cropWidth: 10,
              cropOriginX: 10,
              cropOriginY: 10
            })
            .then(function (ok) {
              agent.get('/api/users/list')
              .expect(200)
              .end(function (err, res) {
                var result = res.body;
                result.should.have.property('urls');
                Array.isArray(result.urls).should.equal(true);
                result.urls[0].should.have.property('UserUrl');
                result.urls[0].url.should.be.a.String();
                result.urls[0].UserUrl.webImage.should.be.a.String;
                result.urls[0].UserUrl.cropHeight.should.be.a.Number;
                result.urls[0].UserUrl.cropWidth.should.be.a.Number;
                result.urls[0].UserUrl.cropOriginX.should.be.a.Number;
                result.urls[0].UserUrl.cropOriginY.should.be.a.Number;
                done();
              });
            });
          })
        });
      });

      
    });

  });

 
});
