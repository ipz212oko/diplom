const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');
const Status = require('./Status');

const OrderHistory = sequelize.define('OrderHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'order_history',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

Order.hasMany(OrderHistory, {
  foreignKey: 'order_id',
  sourceKey: 'id',
  as: 'orderHistories',
});

OrderHistory.belongsTo(Order, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'order',
});

Status.hasMany(OrderHistory, {
  foreignKey: 'status_id',
  sourceKey: 'id',
  as: 'orderHistories',
});

OrderHistory.belongsTo(Status, {
  foreignKey: 'status_id',
  targetKey: 'id',
  as: 'status',
});

module.exports = OrderHistory;
