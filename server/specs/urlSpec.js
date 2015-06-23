var mocha = require('mocha');
var should = require('chai').should();
var expect = require('chai').expect;
var urlCtrl = require('../controllers/urlController');
var db = require("../db");
var sequelize = db.connect('../db/db.sqlite');
var schemas = db.createSchemas(sequelize, false);
var User = schemas.User;
var Url = schemas.Url; 

  sessionObj =  {
    email : 'joe@gmail.com'
  };
  bodyObj =  {
    url : 'www.lakers.com'
  };
  var req = {
    session : sessionObj,
    body : bodyObj,
  };
  var res  = {};
  var next = {};


  urlCtrl.addUrl(req, res, next, function(result){
    console.log('yo');
  }); 

// describe('URL Crud actions', function() {

//   sessionObj =  {
//     email : 'joe@gmail.com'
//   };
//   bodyObj =  {
//     url : 'www.lakers.com'
//   };
//   var req = {
//     session : sessionObj,
//     body : bodyObj,
//   };
//   var res  = {};
//   var next = {};

//   it('should successefully add a url into the DB', function(done) {
//    urlCtrl.addUrl(req, res, next, function(result){
//     expect(result).to.equal('url created'); 
//     done();
//   });  
//  });

//   it('should successfully find a url that exists in the db ', function(done) {
//     urlCtrl.addUrl(req, res, next, function(result){
//       expect(result).to.equal('url found'); 
//       done();
//     });  
//   });

// });



