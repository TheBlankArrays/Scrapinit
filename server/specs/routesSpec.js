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
  syntacticallyCorrectUrl: "http://www.google.com",
  syntacticallyIncorrectUrl : "www.google.com"
},
routes : {
  unProtectedAssets : {
    GET : [
    '/api/users/login',
    '/api/users/signup',
    '/api/users/checkUser'
    ],
    POST : [
    '/api/users/login',
    '/api/users/signup'
    ]
  },
  protectedAssets : {
    GET : [
    '/api/users/logout',
    '/api/users/list_urls'
    ],
    POST : [
    '/api/users/url',
    '/api/users/retrieve_url'
    ]
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

describe('User is not logged in', function(){

  it('should not access a POST route that does not exist', function(done){
    request.post('/fakeRoute')
    .send()
    .end(function (err, res) {
      expect(res.status).to.equal(404);
      done();
    });
  });

  it('should not access a GET route that does not exist', function(done){
    request.get('/fakeRoute')
    .send()
    .end(function (err, res) {
      expect(res.status).to.equal(404);
      done();
    });
  });

  it('should access Unprotected POST route: "/api/users/login"', function(done){
    request.post('/api/users/login')
    .send()
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

  it('should access Unprotected POST route: "/api/users/signup"', function(done){
    request.post('/api/users/signup')
    .send()
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

  it('should access Unprotected POST route: "/api/users/login" - Post with credentials', function(done){
    request.post('/api/users/login')
    .send(utils.testUser)
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

  it('should access Unprotected POST route: "/api/users/signup" - Post with credentials', function(done){
    request.post('/api/users/signup')
    .send(utils.testUser)
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

  it('should access Unprotected GET route: "/api/users/signup"', function(done){
    request.get('/api/users/signup')
    .send()
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

  it('should access Unprotected GET route: "/api/users/checkUser"', function(done){
    request.get('/api/users/checkUser')
    .send()
    .end(function (err, res) {
      expect(res.status).not.to.equal(404);
      done();
    });
  });

});


describe('User is logged in', function(){
  var agent = utils.createAgent();
  var user = utils.signUpUser(utils.testUser, function(err){
    if(err){
      console.log(err);
      
    }
  });  



});


});

