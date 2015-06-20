var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('url', {
    url: Sequelize.STRING
  }, tableConfig)
}