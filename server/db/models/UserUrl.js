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
    },
    comparison: {
      type: Sequelize.STRING,
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
    frequency: {
      type: Sequelize.INTEGER,
      defaultValue: 5
    },
    sockedID {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, tableConfig)
}

