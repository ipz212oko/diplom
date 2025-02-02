const { models } = require("../models");
const jwt = require("jsonwebtoken");

const checkUserIdMiddleware = async (req, res, next) => {
  const userId = req.params.id;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const user = await models.User.findOne({ where: { id:userId } });

  if (!user) {
    return res.status(404).json({ message: 'Такого юзера не існує' });
  }
  if (!token) {
    return res.status(401).json({ message: 'Жетон не надано' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin'&&decoded.id !== user.id) {
      return res.status(403).json({ message: 'У вас немає доступу до цього ресурсу' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = checkUserIdMiddleware;