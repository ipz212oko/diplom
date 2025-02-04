const jwt = require('jsonwebtoken');
const { getTokenFromHeader } = require('../utils/tokenUtils');
const { models } = require("../models");

const isOwnerMiddleware = async (req, res, next) => {
  const userId = req.params.id;
  const  token = getTokenFromHeader(req);
  const user = await models.User.findOne({ where: { id:userId } });

  if (!user) {
    return res.status(404).json({ message: 'Такого юзера не існує' });
  }
  if (!token) {
    return res.status(401).json({ message: 'Жетон не надано' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin'&&decoded.id === user.id) {
      return res.status(403).json({ message: 'Ви не можете поставити собі рейтинг' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недійсний або прострочений маркер' });
  }
};

module.exports = isOwnerMiddleware;