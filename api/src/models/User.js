const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const argon2 = require('argon2');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Імʼя не може бути порожнім',
      },
      notNull: {
        msg: 'Імʼя обовʼязкове',
      },
    },
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Прізвище не може бути порожнім',
      },
      notNull: {
        msg: 'Прізвище обовʼязкове',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Користувач з такою поштою вже існує'
    },
    validate: {
      notEmpty: {
        msg: 'Email не може бути порожнім',
      },
      isEmail: {
        msg: 'Введіть коректний email',
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Роль не може бути порожньою',
      },
      notNull: {
        msg: 'Роль не може бути порожньою',
      },
      isIn: {
        args: [['creator', 'customer']],
        msg: 'Недопустима роль. Доступні варіанти: creator, customer',
      },
    },
  },
  file: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Рейтинг не може бути меншим за 0',
      },
      max: {
        args: [5],
        msg: 'Рейтинг не може бути більшим за 5',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Пароль не може бути порожнім',
      },
      len: {
        args: [4, 100],
        msg: 'Пароль має містити щонайменше 4 символа',
      },
    },
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'регіон не може бути порожнім',
      },
    },
  },
}, {
  tableName: 'user',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await argon2.hash(user.password);
      }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const isHashed = user.password.startsWith('$argon2');
        if (!isHashed) {
          user.password = await argon2.hash(user.password);
        }
      }
    },
  },
});

module.exports = User;

