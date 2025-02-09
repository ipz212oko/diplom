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
    { expiresIn:  process.env.JWT_EXPIRES_IN }
  );
};

module.exports = {
  getTokenFromHeader,
  generateToken
};