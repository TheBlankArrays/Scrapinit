var Sequelize = require("sequelize");

module.exports = function(sequelize, tableConfig) {
  return sequelize.define('UserUrl', {
    comparison: {
      type: Sequelize.STRING,
    },
    compareVal: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    cronVal: {
      type: Sequelize.STRING
    },
    cropImage: {
      type: Sequelize.STRING,
      allowNull: false
    },
    numScrapes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cropHeight: {
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
    cropWidth: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filter: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    frequency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastScrape: {
      type: Sequelize.STRING
    },
    ocrText: {
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
    },
    stopAfterChange: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, tableConfig)
};


