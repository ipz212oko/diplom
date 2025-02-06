const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Skill = require('./Skill');

const UsersSkill = sequelize.define('UsersSkill', {
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
      min: {
        args: [0],
        msg: 'user_id не може бути відʼємним',
      },
      notNull: {
        msg: 'user_id обовʼязкове',
      },
      notEmpty: {
        msg: 'user_id обовʼязкове',
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
  tableName: 'users_skill',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

UsersSkill.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'user',
});

User.hasMany(UsersSkill, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'userSkills',
});

UsersSkill.belongsTo(Skill, {
  foreignKey: 'skill_id',
  targetKey: 'id',
  as: 'skill',
});

Skill.hasMany(UsersSkill, {
  foreignKey: 'skill_id',
  sourceKey: 'id',
  as: 'skillUsers',
});
module.exports = UsersSkill;