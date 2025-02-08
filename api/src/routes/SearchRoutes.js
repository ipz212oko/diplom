const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { models } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const getPaginationParams = require("../utils/pagination");

/**
 * @swagger
 * /api/search/users:
 *   get:
 *     summary: Search for users by name or surname
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The search query (name or surname)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: List of users matching the search query with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       surname:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Bad request
 */
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    if (!query) {
      return res.status(400).json({ error: 'Необхідний параметр запиту' });
    }

    const { count, rows: users } = await models.User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { surname: { [Op.like]: `%${query}%` } }
        ],
        role: { [Op.ne]: 'admin' }
      },
      attributes: { exclude: ['password'] },
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      users
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/search/orders:
 *   get:
 *     summary: Search for orders by title
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The search query (title)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page (default is 10)
 *     responses:
 *       200:
 *         description: List of orders matching the search query with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                         format: float
 *                       region:
 *                         type: string
 *                       worktime:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *       400:
 *         description: Bad request
 */
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    if (!query) {
      return res.status(400).json({ error: 'Необхідний параметр запиту' });
    }

    const { count, rows: orders } = await models.Order.findAndCountAll({
      where: {
        title: { [Op.like]: `%${query}%` }
      },
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orders
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;