const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'time має бути дійсною датою',
      },
      notNull: {
        msg: 'time обовʼязкове',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'текст не може бути порожнім',
      },
    },
  },
}, {
  tableName: 'complaint',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Complaint;
