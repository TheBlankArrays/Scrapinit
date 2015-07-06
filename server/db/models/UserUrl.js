var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cronVal: {
      type: Sequelize.STRING
    },
    compareVal: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    comparison: {
      type: Sequelize.STRING,
    },
    cropImage: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ocrText: {
      type: Sequelize.STRING,
      allowNull: false
    },
    continueAfterChange: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    lastScrape: {
      type: Sequelize.STRING
    },
    filter: {
      type: Sequelize.STRING
      defaultValue: null,
    },
    frequency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sockedID: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, tableConfig)
}
