var serverHost = 'http://localhost:3000';
var supertest = require('supertest');
var request = supertest(serverHost);
var should = require('should');
var assert = require('assert');
var expect = require('expect.js');
var Sequelize = require('sequelize');
var db = require('../dbConfig');

var utils = {
  testUser: {  
    email: "testemail@gmail.com",
    password: '123qwe'
  },
  url : {
    url: "http://www.google.com"
    // syntacticallyIncorrectUrl : "www.google.com"
  },
  urlSpecifics :{
    url: 'string', 
    userUrl: {
      frequency: 5, 
      webImage: 'string', 
      cropImage: '', 
      cropHeight: 1, 
      cropWidth: 2, 
      cropOriginX: 3, 
      cropOriginY: 4
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

describe('Unprotected Routes', function() {
  var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;

  //deletes inserted user from database after all tests are complete
  after(function(done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });

  describe(' - User is not logged in', function(){

    it(' - should not access a POST route that does not exist', function(done){
      request.post('/fakeRoute')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it(' - should not access a GET route that does not exist', function(done){
      request.get('/fakeRoute')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(404);
        done();
      });
    });


    it(' - should access POST route: "/api/users/signup" - with credentials', function(done){
      request.post('/api/users/signup')
      .send(utils.testUser)
      .end(function (err, res) {
        expect(res.status).not.to.equal(404);
        done();
      });
    });

    it(' - should access POST route: "/api/users/signup" - without credentials', function(done){
      request.post('/api/users/signup')
      .send()
      .end(function (err, res) {
        expect(res.status).not.to.equal(404);
        done();
      });
    });

    it(' - should access POST route: "/api/users/login" - with credentials', function(done){
      request.post('/api/users/login')
      .send(utils.testUser)
      .end(function (err, res) {
        expect(res.status).not.to.equal(404);
        done();
      });
    });

    it(' - should access POST route: "/api/users/login" - without credentials', function(done){
      request.post('/api/users/login')
      .send()
      .end(function (err, res) {
        expect(res.status).not.to.equal(404);
        done();
      });
    });

    it(' - should access GET route: "/api/users/check_User"', function(done){
      request.get('/api/users/check_User')
      .send()
      .end(function (err, res) {
        expect(res.status).not.to.equal(404);
        done();
      });
    });

  });


  describe('User is logged in', function(){

    it(' - should not access a POST route that does not exist', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.post('/fakeRoute')
        .send()
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    it(' - should not access a GET route that does not exist', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.get('/fakeRoute')
        .send()
        .end(function (err, res) {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    it(' - should access POST route: "/api/users/signup" - with credentials', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.post('/api/users/signup')
        .send(utils.testUser)
        .end(function (err, res) {
          expect(res.status).not.to.equal(404);
          done();
        });
      });
    });

    it(' - should access POST route: "/api/users/signup" - without credentials', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.post('/api/users/signup')
        .send()
        .end(function (err, res) {
          expect(res.status).not.to.equal(404);
          done();
        });
      });  
    });

    it(' - should access POST route: "/api/users/login" - with credentials', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.post('/api/users/login')
        .send(utils.testUser)
        .end(function (err, res) {
          expect(res.status).not.to.equal(404);
          done();
        });
      });
    });

    it(' - should access POST route: "/api/users/login" - without credentials', function(done){
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        agent.post('/api/users/login')
        .send()
        .end(function (err, res) {
          expect(res.status).not.to.equal(404);
          done();
        });
      });
    });

    it(' - should access GET route: "/api/users/check_User"', function(done){    
      var agent = utils.createAgent();
      utils.logInAgent(agent, utils.testUser, function(user){
        request.get('/api/users/check_User')
        .send()
        .end(function (err, res) {
          expect(res.status).not.to.equal(404);
          done();
        });
      });
    });
  });
});

describe('Protected Routes', function() {
  var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;


  before(function (done) {
    utils.signUpUser(utils.testUser, function (err) {
      done();
    });
  });

  //deletes inserted user from database after all tests are complete
  after(function(done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });

  describe(' - User is not logged in', function(){

    it(' - should not access a GET route "/api/users/logout"', function(done){
      request.get('/api/users/logout')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it(' - should not access a POST route "/api/users/url"', function(done){
      request.post('/api/users/url')
      .send(utils.urlSpecifics)
      .end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it(' - should not access a GET route "/api/users/url/:idUrl"', function(done){
      request.get('/api/users/url/:idUrl')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it(' - should not access a GET route "/api/screenshot"', function(done){
      request.get('/api/screenshot')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it(' - should not access a GET route "/api/users/list"', function(done){
      request.get('/api/users/list')
      .send()
      .end(function (err, res) {
        expect(res.status).to.equal(401);
        done();
      });
    });

  });


describe(' - User is logged in', function(){

  it('should access a GET route "/api/users/logout"', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.get('/api/users/logout')
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        done();
      });
    });
  });

  it(' - should access a POST route "/api/users/url"', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.post('/api/users/url')
      .send(utils.urlSpecifics)
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        done();
      });
    });
  });

  it(' - should fail at accessing a POST route "/api/users/url" - given an invalid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.post('/api/users/url')
      .send(utils)
      .end(function (err, res) {
        expect(res.status).to.be.equal.to(500);
        done();
      });
    });
  });


  xit(' - should access a GET route "/api/users/url/:idUrl" - given a valid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.post('/api/users/url')
      .send(utils.urlSpecifics)
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        var urlID = res.body.urlID;
        //concatenate to /api/users/url/ - route
        agent.get('/api/users/url/' + urlID)
        .send()
        .end(function (err, res) {
          expect(res.status).to.be.within(200, 299);
          done();
        });
      });
    });
  });
  
  xit(' - should fail at accessing a POST route "/api/users/url/:idUrl" - given an invalid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.post('/api/users/url')
      .send(utils.urlSpecifics)
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        var urlID = res.body.urlID;
        //concatenate to /api/users/url/ - route
        agent.get('/api/users/url/' + urlID)
        .send()
        .end(function (err, res) {
          expect(res.status).to.be.within(200, 299);
          done();
        });
      });
    });
  });

  it('should access a GET route "/api/screenshot" - given a valid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.get('/api/screenshot')
      .send(utils.url)
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        done();
      });
    });
  });

  it('should fail at accessing a GET route "/api/screenshot" - given an invalid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.get('/api/screenshot')
      .send(utils)
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        done();
      });
    });
  });

  it('should access a GET route "/api/users/list" - given a valid input', function(done){
    var agent = utils.createAgent();
    utils.logInAgent(agent, utils.testUser, function(user){
      agent.get('/api/users/list')
      .end(function (err, res) {
        expect(res.status).to.be.within(200, 299);
        done();
      });
    });
  });



});


});

