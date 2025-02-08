const { models } = require('../models');

const ownerUserMiddleware = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await models.Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Замовлення не знайдено'
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        message: 'Немає прав для видалення цього замовлення'
      });
    }

    req.order = order;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

module.exports = ownerUserMiddleware;