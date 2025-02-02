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
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
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
