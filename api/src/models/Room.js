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
    validate: {
      isInt: {
        msg: 'user_first_id має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'user_first_id не може бути відʼємним',
      },
      notNull: {
        msg: 'user_first_id обовʼязкове',
      },
      notEmpty: {
        msg: 'user_first_id обовʼязкове',
      },
    },
  },
  user_second_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'user_second_id має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'user_second_id не може бути відʼємним',
      },
      notEmpty: {
        msg: 'user_second_id обовʼязкове',
      },
    },
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
  number: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'number має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'number не може бути відʼємним',
      },
      notEmpty: {
        msg: 'number обовʼязкове',
      },
    },
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
