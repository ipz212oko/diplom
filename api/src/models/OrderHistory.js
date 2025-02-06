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
    validate: {
      isInt: {
        msg: 'order_id має бути цілим числом',
      },
      notNull: {
        msg: 'order_id обовʼязкове',
      },
      notEmpty: {
        msg: 'order_id обовʼязкове',
      },
    },
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'status_id має бути цілим числом',
      },
      notNull: {
        msg: 'status_id обовʼязкове',
      },
      notEmpty: {
        msg: 'status_id обовʼязкове',
      },
    },
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
      notEmpty: {
        msg: 'time обовʼязкове',
      },
    },
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
