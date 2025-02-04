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
    validate: {
      notEmpty: {
        msg: 'Назва не може бути порожньою',
      },
      notNull: {
        msg: 'Назва не може бути порожньою',
      },
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Ціна не може бути порожньою',
      },
      notNull: {
        msg: 'Ціна не може бути порожньою',
      },
      min: {
        args: [0],
        msg: 'Ціна не може бути меншою за 0',
      },
    },
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  worktime: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'order',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
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
