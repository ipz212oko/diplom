const express = require('express');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const { models } = require("../models");
const { generateToken } = require("../utils/tokenUtils");

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login and returns a JWT token
 *     description: Authenticates a user by their email and password, and returns a JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successful login, returns a JWT token and user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       400:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
  }
  try {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Вхід успішний',token:token });
  } catch (error) {
    res.status(400).json({ message:error });
  }
});

module.exports = router;

