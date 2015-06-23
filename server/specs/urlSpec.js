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
  url : {
    url :"http://www.google.com"
  },
  signUpUser: function(credentials, callback) {
    request.post('/signup')
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

  destroyUser: function(schema, credentials, callback) {
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
  }
};



describe('URL CRUD actions', function() {
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





  it('server should respond, to a Add URL request, with a status code of 403 if user is not logged in', function(done) {
    request.post('/api/user/url')
        .send(utils.url)
        .expect(403)
        .end(function (err, res) {
          done();
        });
  });  

  it('server should respond, to a Add URL request, with a status code of 201 if user is logged in and URL does not exist', function(done) {
    request.post('/api/user/signup')
      .send(utils.testUser)
      .expect(201)
      .end(function (err, res) {
        request.post('/api/user/url')
          .send(utils.url)
          .expect(201)
          done();
        });
 
  });

  it('server should respond, to a Add URL request, with a status code of 201 if is logged in and url exists in the database', function(done) {
    request.post('/api/user/url')
        .send(utils.url)
        .expect(201)
        .end(function (err, res) {
          request.post('/api/user/url')
            .send(utils.url)
            .expect(201)
            done();
          });    
  });  




});



