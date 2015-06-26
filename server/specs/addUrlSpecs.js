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

  newUrl: {
    url: 'http://www.google.com', 
    urlImg: '../client/assets/test/www.google.com.jpg',
    crop: {
      x: 2,
      y: 2,
      w: 1,
      h: 1
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

describe('API add url', function () {
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

  describe('POST URL', function () {

    it('Return 401 if user is not logged', function (done) {
      request.post('/api/users/url')
      .send(utils.newUrl)
      .end(function (err, res) {
        res.status.should.be.equal(401);
        done();
      });
    });

    it('Return 400 if user is logged but the URL parameters without url property', function (done) {
      var agent = utils.createAgent();
      var badUrl = {
        url: '', 
        urlImg: '../client/assets/test/www.google.com.jpg',
        crop: {
          x: 2,
          y: 2,
          w: 1,
          h: 1
        }
      };
      utils.logInAgent(agent, utils.testUser, function (user) {
        agent.post('/api/users/url')
        .send(badUrl)
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });
    });

    it('Return 400 if user is logged but the URL parameters without urlImage property', function (done) {
      var agent = utils.createAgent();
      var badUrl = {
        url: 'http://www.google.com', 
        urlImg: '',
        crop: {
          x: 2,
          y: 2,
          w: 1,
          h: 1
        }
      };
      utils.logInAgent(agent, utils.testUser, function (user) {
        agent.post('/api/users/url')
        .send(badUrl)
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });    
    });

    it('Return 400 if user is logged but the URL parameters without crop property', function (done) {
      var agent = utils.createAgent();
      var badUrl = {
        url: 'http://www.google.com', 
        urlImg: '../client/assets/test/www.google.com.jpg',
        crop: {}
      };
      utils.logInAgent(agent, utils.testUser, function (user) {
        agent.post('/api/users/url')
        .send(badUrl)
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });
    });

    it('Return 201 if user is logged and the parameters is good', function (done) {
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function (user) {
        agent.post('/api/users/url')
        .send(utils.newUrl)
        .end(function (err, res) {
          res.status.should.be.equal(201);
          var url = res.body;
          url.should.have.property('UserUrl').and.should.be.an.Object;
          url.should.have.property('url').and.should.be.a.String;
          url.should.be.a.String();
          url.UserUrl.webImage.should.be.a.String;
          url.UserUrl.cropHeight.should.be.a.Number;
          url.UserUrl.cropWidth.should.be.a.Number;
          url.UserUrl.cropOriginX.should.be.a.Number;
          url.UserUrl.cropOriginY.should.be.a.Number;
          done();
        });
      });
    });

  });

 
});
