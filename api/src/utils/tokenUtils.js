const jwt = require('jsonwebtoken');

const getTokenFromHeader = (req) => {
  const authHeader = req.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  getTokenFromHeader,
  generateToken
};