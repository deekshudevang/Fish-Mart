const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Settings = sequelize.define('Settings', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Settings;
