var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    url: Sequelize.STRING,
    frequency: Sequelize.INTEGER
  }, tableConfig)
}