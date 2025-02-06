const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Skill = sequelize.define('Skill', {
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
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'image обовʼязкове',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'description обовʼязкове',
      },
    },
  },
}, {
  tableName: 'skill',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Skill;
