var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('url', {
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, tableConfig)
};

