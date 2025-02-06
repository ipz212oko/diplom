const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Comment = sequelize.define('Comment', {
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
    },
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  sendtime: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'дата має бути дійсною датою',
      },
      notNull: {
        msg: 'дата обовʼязкове',
      },
    },
  },
}, {
  tableName: 'comment',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'userComments',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'user',
});

Comment.hasMany(Comment, {
  foreignKey: 'parent_id',
  sourceKey: 'id',
  as: 'childComments',
});

Comment.belongsTo(Comment, {
  foreignKey: 'parent_id',
  targetKey: 'id',
  as: 'parentComment',
});

module.exports = Comment;
