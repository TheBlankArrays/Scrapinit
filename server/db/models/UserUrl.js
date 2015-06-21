var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    html: Sequelize.STRING,
    selector: Sequelize.STRING,
    frequency: Sequelize.INTEGER,
  }, tableConfig)
}