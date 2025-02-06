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
    validate: {
      isInt: {
        msg: 'user_id має бути цілим числом',
      },
      notNull: {
        msg: 'user_id обовʼязкове',
      },
      notEmpty: {
        msg: 'user_id не може бути пустим',
      },
    },
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'room_id має бути цілим числом',
      },
      notNull: {
        msg: 'room_id обовʼязкове',
      },
      notEmpty: {
        msg: 'room_id не може бути пустим',
      },
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'date має бути дійсною датою',
      },
      notNull: {
        msg: 'date обовʼязкове',
      },
    },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'текст не може бути порожнім',
      },
      notNull: {
        msg: 'текст обовʼязкове',
      },
    },
  },
}, {
  tableName: 'message',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
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
