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
  },
  skill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'users_skill',
  timestamps: false,
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