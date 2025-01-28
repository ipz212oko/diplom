const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Status = sequelize.define('Status', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'status',
  timestamps: false,
});

module.exports = Status;

