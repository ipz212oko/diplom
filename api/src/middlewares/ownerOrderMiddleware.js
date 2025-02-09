const { models } = require('../models');
const { getTokenFromHeader } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");

const ownerOrderMiddleware  = (field = "order") =>  {
  return async (req, res, next) => {
    try {
      let orderId = null;
      if(field === "order"){
         orderId = req.body.order_id || req.params.id;
      }else if(field === "orderSkill"){
        const ordersSkill = await models.OrdersSkill.findByPk(req.params.id);
        orderId =  ordersSkill.order_id;
      }
      const order = await models.Order.findByPk(orderId);
      const token = getTokenFromHeader(req);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!order) {
        return res.status(404).json({
          message: 'Замовлення не знайдено'
        });
      }

      if (decoded.role !== 'admin' && order.user_id !== decoded.id) {
        return res.status(403).json({
          message: 'Дія заборонена'
        });
      }

      req.order = order;
      next();
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
};

module.exports = ownerOrderMiddleware;