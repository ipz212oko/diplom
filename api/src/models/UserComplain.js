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
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'complaint_id має бути цілим числом',
      },
      min: {
        args: [0],
        msg: 'complaint_id не може бути відʼємним',
      },
      notNull: {
        msg: 'complaint_id обовʼязкове',
      },
      notEmpty: {
        msg: 'complaint_id обовʼязкове',
      },
    },
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
