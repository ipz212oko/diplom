const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Room = require('./Room');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'message',
  timestamps: false,
});

User.hasMany(Message, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'messages',
});

Message.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'user',
});

Room.hasMany(Message, {
  foreignKey: 'room_id',
  sourceKey: 'id',
  as: 'messages',
});

Message.belongsTo(Room, {
  foreignKey: 'room_id',
  targetKey: 'id',
  as: 'room',
});

module.exports = Message;
