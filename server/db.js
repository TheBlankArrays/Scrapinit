var Sequelize = require("sequelize");
var dbConfig = require("./dbConfig");

var sequelize = dbConfig.connect('./db/db.sqlite');
var schemas = dbConfig.createSchemas(sequelize, true);

/**
  * Export the differents models
**/

var User = schemas.User;
var Url = schemas.Url;
var UserUrl = schemas.UserUrl;

User.insert = function(user) {
  User.create(user);
};

// updates a user which is accessed with userName, with newVal object
User.update = function(userName, newVal) {
  User.update(
    newVal,
    {where: userName})
};

// will I get a string or an object?
User.select = function(userEmail) {
  return User.find({where: {email: userEmail}});
};

User.getUrls = function(user, cb) {
  // user will be an email string
  User.find({where: {email: user}})
    .then(function(userObj) {
      cb(userObj.getUrls());
    })
};

// should select with an email. Object or string?
User.destroy = function(user) {
  User.find({where: {email: user.email}})
    .then(function(foundUser) {
      foundUser.destroy()
    })
};

// need to make a connection to a user??
Url.insert = function(user, url) {
  user.addUrl(url);
};

Url.select = function(url) {
  Url.find({where: {url: url}})
};

Url.destroy = function() {

};

// UserUrl.insert = function() {

// }

// UserUrl.select = function() {

// }

// UserUrl.destroy = function() {

// }

exports.User = schemas.User;
exports.Url = schemas.Url;
exports.UserUrl = schemas.UserUsrl;
