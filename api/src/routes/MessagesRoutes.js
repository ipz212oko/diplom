const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const getPaginationParams = require("../utils/pagination");

const router = express.Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               text:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const message = await models.Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages with pagination
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
 *         description: Number of messages per page (default is 10)
 *     responses:
 *       200:
 *         description: List of messages with pagination metadata
 */
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: messages } = await models.Message.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      messages
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message details
 *       404:
 *         description: Повідомлення не знайдено
 */
router.get('/:id', async (req, res) => {
  try {
    const message = await models.Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   patch:
 *     summary: Partially update message
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to update
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
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Повідомлення не знайдено
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await models.Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }

    await message.update(req.body);
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete message
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the message to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Message deleted successfully
 *       404:
 *         description: Повідомлення не знайдено
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await models.Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Повідомлення не знайдено' });
    }
    await message.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
