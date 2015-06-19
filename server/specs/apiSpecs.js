/* server must be running when you executes the tests 
	run the test with "mocha apiSpecs.js" */
var serverHost = 'http://localhost:3000';
var should = require('should');
var assert = require('assert');
var supertest = require('supertest');
var request = supertest(serverHost);
var Sequelize = require('sequelize');
var db = require('../dbConfig');

var utils = {
	testUser: {
		username: 'testUser',
		email: "testemail@gmail.com",
		password: '123qwe'
	}
}

describe('API', function() {
	
});
