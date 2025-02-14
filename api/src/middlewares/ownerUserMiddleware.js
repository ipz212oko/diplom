const { models } = require('../models');
const { getTokenFromHeader } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");

const ownerUserMiddleware  = (field = "user") => {
  return  async (req, res, next) => {
  try {
    let userId = null;
    if(field === "user"){
      userId = req.body.user_id || req.params.id;
    }else if(field === "userSkill"){
      const usersSkill = await models.UsersSkill.findByPk(req.params.id);
      userId =  usersSkill.user_id;
    }else if(field === "userSender"){
      userId=req.body.sender_id;
    }

    const user = await models.User.findByPk(userId);
    const token = getTokenFromHeader(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      return res.status(404).json({
        message: 'Такий юзер не існує'
      });
    }

    if (decoded.role !== 'admin' && user.id !== decoded.id) {
      return res.status(403).json({
        message: 'Дія заборонена'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }}
};

module.exports = ownerUserMiddleware;