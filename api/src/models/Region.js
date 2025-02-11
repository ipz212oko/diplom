const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  alpha2: {
    type: DataTypes.STRING(2),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 2],
    },
  },
  alpha3: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 3],
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'region',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

module.exports = Region;
