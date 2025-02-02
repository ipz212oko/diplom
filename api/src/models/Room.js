const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Order = require('./Order');


const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_first_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_second_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'room',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

User.hasMany(Room, {
  foreignKey: 'user_first_id',
  sourceKey: 'id',
  as: 'firstRooms',
});

User.hasMany(Room, {
  foreignKey: 'user_second_id',
  sourceKey: 'id',
  as: 'secondRooms',
});

Room.belongsTo(User, {
  foreignKey: 'user_first_id',
  targetKey: 'id',
  as: 'userFirst',
});

Room.belongsTo(User, {
  foreignKey: 'user_second_id',
  targetKey: 'id',
  as: 'userSecond',
});

Order.hasMany(Room, {
  foreignKey: 'order_id',
  sourceKey: 'id',
  as: 'rooms',
});

Room.belongsTo(Order, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'order',
});

module.exports = Room;
