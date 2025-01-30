const jwt = require('jsonwebtoken');
const { models } = require("../models");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await models.User.findOne({
            where: { email: decoded.email }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
         next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
