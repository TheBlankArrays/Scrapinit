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

describe('API AUTH USER', function() {
	var sequelize = db.connect('../db/db.sqlite');
  //pass the the second parameter as false so that the function does not execute sync()
  var schemas = db.createSchemas(sequelize,false);
  //schemas that will be used to execute queries
  var User = schemas.User;


  afterEach(function(done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });
  describe('user management', function () {



    describe('Route ', function () {

      it('signup should return 201 when the user is created successfully', function (done) {
        request.post('/api/users/signup')
        .send(utils.testUser)
        .end(function (err, res) {
          res.status.should.be.equal(201);
          done();
        });
      });

      it('Signup should encrypt the password into the database', function (done) {
        request.post('/api/users/signup')
        .send(utils.testUser)
        .end(function (err, res) {
          res.status.should.be.equal(201);
          User.findOne({
            where: {email: utils.testUser.email}
          }).then(function (userFound) {
            var password = userFound.password;
            var compared = bcrypt.compareSync(utils.testUser.password, password);
            compared.should.equal(true);
            done();
          });
        });
      });

      it('login should respond with status code 200 if username/password is correct', function (done) {
        request.post('/api/users/signup')
        .send(utils.testUser)
        .end(function (err, res) {
          res.status.should.be.equal(201);
          request.post('/api/users/login')
          .send(utils.testUser)
          .end(function (err, res) {
            res.status.should.be.equal(200);
            done();
          });
        });
      });

      it('login should respond with status code 400 if username/password is incorrect', function (done) {
        var wrongTestUser = {
          username: "doesntexist",
          password: "wrongpassword"
        };
        request.post('/api/users/login')
        .send(wrongTestUser)
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });

    });

  });

  describe('user validations', function () {

    describe('signup and login/logout', function () {

      it('Return 400 if email is empty', function (done) {
        request.post('/api/users/login')
        .send({
          email: null,
          password: '123qwe'
        })
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });

      it('Return 400 if password is empty', function (done) {
        request.post('/api/users/login')
        .send({
          email: 'Pepe',
          password: null,
        })
        .end(function (err, res) {
          res.status.should.be.equal(400);
          done();
        });
      });

      it('Return 400 if email is already exist', function (done) {
        request.post('/api/users/login')
        .send(utils.testUser)
        .end(function (err, res) {
          request.post('/api/users/login')
          .send(utils.testUser)
          .end(function (err, res) {
            res.status.should.be.equal(400);
            done();
          });
        });
      });

    });
  });
});
