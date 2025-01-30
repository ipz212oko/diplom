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
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'order_skill',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
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
