const jwt = require('jsonwebtoken');

const roleMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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