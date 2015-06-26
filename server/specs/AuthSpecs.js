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

  //deletes inserted user from database after all tests are complete
  after(function(done) {
    utils.destroyUser(User, utils.testUser, function () {
      done();
    });
  });

  describe('user management', function () {

    describe('Route ', function () {

      it('signup should return 201 when the user is created successfully', function (done) {
        request.post('/api/user/signup')
        .send(utils.testUser)
        .expect(201)
        .end(function (err, res) {
          done();
        });
      });

      it('signup should respond with status code 401 if username already exists', function (done) {
        request.post('/api/user/signup')
        .send(utils.testUser)
        .expect(201)
        .end(function (err, res) {
          request.post('/api/user/login')
          .send(utils.testUser)
          .expect(401)
          .end(function (err, res) {
            done();
          });
        })
      });

      it('Signup should encrypt the password into the database', function (done) {
        request.post('/api/users/signup')
        .send(utils.testUser)
        .expect(201)
        .end(function (err, res) {
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
        request.post('/api/user/signup')
        .send(utils.testUser)
        .expect(201)
        .end(function (err, res) {
          request.post('/api/user/login')
          .send(utils.testUser)
          .expect(200)
          .end(function (err, res) {
            done();
          });
        });
      });

      it('login should respond with status code 401 if username/password is incorrect', function (done) {
        var wrongTestUser = {
          username: "doesntexist",
          password: "wrongpassword"
        };
        request.post('/api/user/login')
        .send(wrongTestUser)
        .expect(401)
        .end(function (err, res) {
          done();
        });
      });

    });

  });

  describe('user validations', function () {

    describe('signup and login/logout', function () {

      it('Return 403 if email is empty', function (done) {
        request.post('/api/user/login')
        .send({
          email: null,
          password: '123qwe'
        })
        .expect(403)
        .end(function (err, res) {
          done();
        });
      });

      it('Return 403 if password is empty', function (done) {
        request.post('/api/user/login')
        .send({
          email: 'Pepe',
          password: null,
        })
        .expect(403)
        .end(function (err, res) {
          done();
        });
      });

      it('Return 403 if email is already exist', function (done) {
        request.post('/api/user/login')
        .send(utils.testUser)
        .expect(201)
        .end(function (err, res) {
          request.post('/api/user/login')
          .send(utils.testUser)
          .expect(403)
          .end(function (err, res) {
            done();
          });
        });
      });

    });
  });
});
