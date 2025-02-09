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
 *     summary: Search and filter users
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Optional search query for name or surname
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by user's region
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Filter by user's rating
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [creator, customer]
 *         description: Filter by user's role (creator or customer)
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Filter by user's skills (JSON array of IDs)
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
 *         description: List of filtered users with pagination metadata
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
 *                       role:
 *                         type: string
 *                       region:
 *                         type: string
 *                       rating:
 *                         type: number
 *       400:
 *         description: Bad request
 */
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const { query, region, rating, role, skills } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    const whereCondition = {
      role: { [Op.ne]: 'admin' }
    };

    if (query) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { surname: { [Op.like]: `%${query}%` } }
      ];
    }

    if (region) {
      whereCondition.region = { [Op.like]: `%${region}%` };
    }

    if (role && ['creator', 'customer'].includes(role)) {
      whereCondition.role = role;
    }

    if (rating) {
      const ratingValue = parseFloat(rating);
      if (!isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5) {
        whereCondition.rating = ratingValue;
      }
    }

    const queryOptions = {
      where: whereCondition,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      distinct: true,
    };

    if (skills) {
      let skillIds;
      try {
        skillIds = JSON.parse(skills);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid skills format' });
      }

      if (Array.isArray(skillIds) && skillIds.length > 0 && !skillIds.some(isNaN)) {
        queryOptions.include = [{
          model: models.UsersSkill,
          as: 'userSkills',
          required: true,
          where: {
            skill_id: {
              [Op.in]: skillIds
            }
          },
          include: [{
            model: models.Skill,
            as: 'skill',
          }]
        }];
      } else {
        return res.status(400).json({ message: 'Invalid skills format' });
      }
    }

    const { count, rows: users } = await models.User.findAndCountAll(queryOptions);

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      users
    });
  } catch (error) {
    console.error('Error in users search:', error);
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/search/orders:
 *   get:
 *     summary: Search for orders with optional filters
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by title (optional)
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter by exact price (optional)
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region (optional)
 *       - in: query
 *         name: worktime
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by worktime date (optional)
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Filter by skill IDs (JSON array of IDs)
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
 *         description: List of orders matching the filters with pagination metadata
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
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *       400:
 *         description: Bad request
 */
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { query, price, region, worktime, skills } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    const whereConditions = {};
    const queryOptions = {
      where: whereConditions,
      limit,
      offset,
      distinct: true,
      subQuery: false
    };

    if (query) {
      whereConditions.title = { [Op.like]: `%${query}%` };
    }
    if (price) {
      whereConditions.price = price;
    }
    if (region) {
      whereConditions.region = region;
    }
    if (worktime) {
      whereConditions.worktime = worktime;
    }

    if (skills) {
      let skillIds;
      try {
        skillIds = JSON.parse(skills);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid skills format' });
      }

      if (Array.isArray(skillIds) && skillIds.length > 0 && !skillIds.some(isNaN)) {
        queryOptions.include = [{
          model: models.OrdersSkill,
          as: 'orderSkills',
          required: true,
          where: {
            skill_id: {
              [Op.in]: skillIds
            }
          },
          include: [{
            model: models.Skill,
            as: 'skill',
            attributes: ['id', 'title']
          }]
        }];
      } else {
        return res.status(400).json({ message: 'Invalid skills format' });
      }
    }

    const { count, rows: orders } = await models.Order.findAndCountAll(queryOptions);

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orders
    });
  } catch (error) {
    console.error('Error in orders search:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;