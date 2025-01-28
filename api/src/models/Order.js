const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Status = require('./Status');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  worktime: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'order',
  timestamps: false,
});

Status.hasMany(Order, {
  foreignKey: 'status_id',
  sourceKey: 'id',
  as: 'status',
});

Order.belongsTo(Status, {
  foreignKey: 'status_id',
  targetKey: 'id',
});

module.exports = Order;
