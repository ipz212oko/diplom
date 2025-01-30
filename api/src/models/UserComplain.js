const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Complaint = require('./Complaint');

const UserComplain = sequelize.define('UserComplain', {
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
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'user_complain',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

User.hasMany(UserComplain, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'userComplaints',
});

UserComplain.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  as: 'user',
});

Complaint.hasMany(UserComplain, {
  foreignKey: 'complaint_id',
  sourceKey: 'id',
  as: 'complaintUsers',
});

UserComplain.belongsTo(Complaint, {
  foreignKey: 'complaint_id',
  targetKey: 'id',
  as: 'complaint',
});

module.exports = UserComplain;
