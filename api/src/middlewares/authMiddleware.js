const jwt = require('jsonwebtoken');
const { models } = require("../models");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Жетон не надано' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await models.User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Недійсний або прострочений маркер' });
    }
};

module.exports = authMiddleware;

