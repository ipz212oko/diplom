const express = require('express');
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const checkUserIdMiddleware = require("../middlewares/checkUserIdMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 default: customer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 */

router.post('/', async (req, res) => {
    try {
        const user = await models.User.create(req.body);
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, token: token });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => err.message);
            res.status(400).json({ error: 'Validation error', details: validationErrors });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/',authMiddleware, async (req, res) => {
    try {
        const users = await models.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information from JWT
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await models.User.findOne({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const userInfo = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role,
            email: user.email
        };

        res.status(200).json(userInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: Користувача не знайдено
 */
router.get('/:id',authMiddleware, async (req, res) => {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Partially update user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Користувача не знайдено
 */

router.patch('/:id',authMiddleware,checkUserIdMiddleware, async (req, res) => {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }


        const updatedFields = {};
        if (req.body.name) updatedFields.name = req.body.name;
        if (req.body.surname) updatedFields.surname = req.body.surname;
        if (req.body.email) updatedFields.email = req.body.email;
        if (req.body.password) updatedFields.password = req.body.password;
        if (req.body.description) updatedFields.description = req.body.description;
        if (req.body.rating) updatedFields.rating = req.body.rating;

        await user.update(updatedFields);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: Користувача не знайдено
 */
router.delete('/:id', authMiddleware,checkUserIdMiddleware, async (req, res) => {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
