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

  testUser2: {
    email: "testemail2@gmail.com",
    password: "123qwe"
  },

  newUrl = {
    url: 'string', 
    userUrl: {
      frequency: 5, 
      webImage: 'string', 
      cropImage: 'string 2', 
      cropHeight: 10, 
      cropWidth: 10, 
      cropOriginX: 10, 
      cropOriginY: 10
    }
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

describe('API', function () {
  var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;
  var Url = schemas.Url;
  var UserUrl = schemas.UserUrl;

  before(function (done) {
    utils.signUpUser(utils.testUser, function (err) {
      utils.signUpUser(utils.testUser2, function (err) {
        done();
      });
    });
  });

  //deletes inserted user from database after all tests are complete
  after(function (done) {
    utils.destroyUser(User, utils.testUser, function () {
      utils.destroyUser(User, utils.testUser2, function () {
        done();
      });
    });
  });

  describe('GET URL', function () {

    describe('Route /api/users/url/:idUrl', function () {
      
      it('Should return 403 when request to url', function (done) {
        request.get('/api/users/url/1')
        .expect(403)
        .end(function (err, res) {
          done();
        });
      });

      it('Should return 403 when the user is logged and the url is not assocciated', function (done) {
        var agent = utils.createAgent();
        var agent2 = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          utils.logInAgent(agent2, utils.testUser2, function (user2) {
            agent2.post('/api/users/url')
            .send(utils.newUrl)
            .expect(201)
            .end(function (err, res) {
              var newUrl = res.body;
              agent.get('/api/users/url/' + newUrl.id)
              .expect(403)
              .end(function (err, res) {
                done();
              });
            });
          });
        });
      });

      it('Should return 200 with url object when the user is logged and the url is associated', function (done) {
        var agent = utils.createAgent();
        utils.logInAgent(agent, utils.testUser, function (user) {
          agent.post('/api/users/url')
          .send(utils.newUrl)
          .expect(201)
          .end(function (err, res) {
            var newUrl = res.body;
            agent.get('/api/users/url/' + newUrl.id)
            .expect(200)
            .end(function (err, res) {
              var url = res.body;
              url: 'string', 
              url.should.have.property('url').and.be.a.String;
              url.should.have.property('UserUrl').and.be.an.Object;
              url.UserUrl.should.have.property('frequency').and.be.a.Number;
              url.UserUrl.should.have.property('webImage').and.be.a.String;
              url.UserUrl.should.have.property('cropImage').and.be.a.String;
              url.UserUrl.should.have.property('cropHeight').and.be.a.Number;
              url.UserUrl.should.have.property('cropWidth').and.be.a.Number;
              url.UserUrl.should.have.property('cropOriginX').and.be.a.Number;
              url.UserUrl.should.have.property('cropOriginY').and.be.a.Number;
              done();
            });
          });
        });
      });

    });

  });

 
});
