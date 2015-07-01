var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    email: {
      type: Sequelize.STRING,
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
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
  }, tableConfig)
}

