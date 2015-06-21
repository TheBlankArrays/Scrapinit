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
    email: {
      type: Sequelize.STRING,
      unique: { 
        msg: 'Email already exists' 
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email is not valid'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set:  function(pass) {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(pass, salt);
          this.setDataValue('password', hash);
      }
    }
  }, tableConfig); 
};
