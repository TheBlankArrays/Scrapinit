var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    webImage: Sequelize.STRING,
    cropImage: Sequelize.STRING,
    cropHeight: Sequelize.INTEGER,
    cropWidth: Sequelize.INTEGER,
    cropOriginX: Sequelize.INTEGER,
    cropOriginY: Sequelize.INTEGER,
    status: Sequelize.BOOLEAN,
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
  }, tableConfig)
}

