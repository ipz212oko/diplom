const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { models } = require("../models");
const getPaginationParams = require("../utils/pagination");

const router = express.Router();

/**
 * @swagger
 * /api/user-complaints:
 *   post:
 *     summary: Create a new user complaint relation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               complaint_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User complaint relation created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userComplain = await models.UserComplain.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user-complaints:
 *   get:
 *     summary: Get all user complaint relations with pagination
 *     parameters:
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
 *         description: Number of user complaint relations per page (default is 10)
 *     responses:
 *       200:
 *         description: List of user complaint relations with pagination metadata
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: userComplaints } = await models.UserComplain.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      userComplaints
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/user-complaints/{id}:
 *   get:
 *     summary: Get a user complaint relation by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user complaint relation
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User complaint relation details
 *       404:
 *         description: Звязок зі скаргою користувача не знайдено
 */
router.get('/:id',authMiddleware, async (req, res) => {
  try {
    const userComplain = await models.UserComplain.findByPk(req.params.id);
    if (!userComplain) {
      return res.status(404).json({ message: 'Звязок зі скаргою користувача не знайдено' });
    }
    res.status(200).json(userComplain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user-complaints/{id}:
 *   patch:
 *     summary: Partially update user complaint relation
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user complaint relation to update
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
 *               user_id:
 *                 type: integer
 *               complaint_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User complaint relation updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Звязок зі скаргою користувача не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const userComplain = await models.UserComplain.findByPk(req.params.id);
    if (!userComplain) {
      return res.status(404).json({ message: 'Звязок зі скаргою користувача не знайдено' });
    }

    const updatedFields = {};
    if (req.body.user_id) updatedFields.user_id = req.body.user_id;
    if (req.body.complaint_id) updatedFields.complaint_id = req.body.complaint_id;

    await userComplain.update(updatedFields);
    res.status(200).json(userComplain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/user-complaints/{id}:
 *   delete:
 *     summary: Delete user complaint relation
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user complaint relation to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User complaint relation deleted successfully
 *       404:
 *         description: Звязок зі скаргою користувача не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const userComplain = await models.UserComplain.findByPk(req.params.id);
    if (!userComplain) {
      return res.status(404).json({ message: 'Звязок зі скаргою користувача не знайдено' });
    }
    await userComplain.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
