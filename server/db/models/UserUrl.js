var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    html: Sequelize.STRING,
    selector: Sequelize.STRING,
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
  }, tableConfig)
}