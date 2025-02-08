const { models } = require('../models');
const { getTokenFromHeader } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");

const ownerRoomMiddleware  = (field = "get") =>  {
 return async (req, res, next) =>
{
  try {
    const token = getTokenFromHeader(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(field=== "post"){
      if (decoded.role !== 'admin' && decoded.id !== req.body.user_first_id && decoded.id !== req.body.user_second_id) {
        return res.status(403).json({
          message: 'Дія заборонена'
        });
      }
    }else if(field=== "get"){
      const  room = await models.Room.findByPk(req.params.id);
      if (decoded.role !== 'admin' && decoded.id !== room.user_first_id && decoded.id !== room.user_second_id) {
        return res.status(403).json({
          message: 'Дія заборонена'
        });
      }
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}
};

module.exports = ownerRoomMiddleware;