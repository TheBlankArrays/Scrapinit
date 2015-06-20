var Sequelize = require("sequelize");
var bcrypt = require("bcrypt");


module.exports = function(sequelize, tableConfig) {
  tableConfig.instanceMethods = {
    comparePasswords: function (password, callback) {
      bcrypt.compare(password, this.password, function (err, result) {
        console.log('password ', password, result);
        if (err || !result) {
          callback(false);
        }else {
          callback(true);
        }
      });
    }
  };
  return sequelize.define('user', {
    email: Sequelize.STRING,
    password: {
      type: Sequelize.STRING,
      set:  function(pass) {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(pass, salt);
          this.setDataValue('password', hash);
      }
    }
  }, tableConfig); 
};
