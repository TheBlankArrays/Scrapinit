var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    email: {
      Sequelize.STRING,
      allowNull: false
    },
    webImage: {
      type: Sequelize.STRING
    },
    cropImage: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cropHeight: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cropWidth: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cropOriginX: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cropOriginY: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: Sequelize.BOOLEAN,
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
  }, tableConfig)
}

