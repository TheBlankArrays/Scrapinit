var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('user', {
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }, tableConfig); 
};