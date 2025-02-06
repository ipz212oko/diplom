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
    validate: {
      notEmpty: {
        msg: 'region не може бути пустим',
      },
    },
  },
  worktime: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'worktime має бути дійсною датою',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'description не може бути пустим',
      },
    },
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
