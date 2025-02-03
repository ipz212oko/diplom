const jwt = require('jsonwebtoken');
const { getTokenFromHeader } = require('../utils/tokenUtils');

const roleMiddleware = async (req, res, next) => {
  const  token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: 'Жетон не надано' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недійсний або прострочений маркер' });
  }
};

module.exports = roleMiddleware;