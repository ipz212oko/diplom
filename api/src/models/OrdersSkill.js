const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');
const Skill = require('./Skill');

const OrdersSkill = sequelize.define('OrderSkill', {
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
      min: {
        args: [0],
        msg: 'order_id не може бути відʼємним',
      },
      notNull: {
        msg: 'order_id обовʼязкове',
      },
      notEmpty: {
        msg: 'order_id обовʼязкове',
      },
    },
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'skill_id має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'skill_id не може бути відʼємним',
      },
      notNull: {
        msg: 'skill_id обовʼязкове',
      },
      notEmpty: {
        msg: 'skill_id обовʼязкове',
      },
    },
  },
}, {
  tableName: 'order_skill',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      unique: true,
      fields: ['order_id', 'skill_id'],
      name: 'order_skill_unique',
      error_messages: {
        unique: 'Ця навичка вже додана для даного замовлення'
      }
    }
  ]
});

Order.hasMany(OrdersSkill, {
  foreignKey: 'order_id',
  sourceKey: 'id',
  as: 'orderSkills',
});

OrdersSkill.belongsTo(Order, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'order',
});

Skill.hasMany(OrdersSkill, {
  foreignKey: 'skill_id',
  sourceKey: 'id',
  as: 'skillOrders',
});

OrdersSkill.belongsTo(Skill, {
  foreignKey: 'skill_id',
  targetKey: 'id',
  as: 'skill',
});

module.exports = OrdersSkill;
