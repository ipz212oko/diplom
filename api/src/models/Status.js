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
    validate: {
      notEmpty: {
        msg: 'Назва не може бути порожньою',
      },
      notNull: {
        msg: 'Назва обовʼязкова',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'description не може бути порожнім',
      },
    },
  },
}, {
  tableName: 'status',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Status;

