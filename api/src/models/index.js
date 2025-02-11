const { sequelize } = require('../config/database');
const User = require('./User');
const Status = require('./Status');
const Order = require('./Order');
const Message = require('./Message');
const Room = require('./Room');
const OrderHistory = require('./OrderHistory');
const Skill = require('./Skill');
const UsersSkill = require('./UsersSkill');
const OrdersSkill = require('./OrdersSkill');
const UserComplain = require('./UserComplain');
const Complaint = require('./Complaint');
const Comment = require('./Comment');
const Region = require('./Region');

const models = {
  Region,
  User,
  Status,
   Order,
   Room,
   Message,
   OrderHistory,
   Skill,
   UsersSkill,
   OrdersSkill,
   Complaint,
   UserComplain,
   Comment
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = { sequelize, models };