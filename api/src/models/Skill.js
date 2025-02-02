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
        msg: 'Назва не може бути порожньою',
      },
    },
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Рейтинг має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'Рейтинг не може бути меншим за 0',
      },
      max: {
        args: [5],
        msg: 'Рейтинг не може бути більшим за 5',
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
