const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const roleMiddleware = require("../middlewares/roleMiddleware");
const ownerRoomMiddleware = require("../middlewares/ownerRoomMiddleware");
const getPaginationParams = require("../utils/pagination");

const router = express.Router();

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_first_id:
 *                 type: integer
 *               user_second_id:
 *                 type: integer
 *               order_id:
 *                 type: integer
 *               number:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,ownerRoomMiddleware('post'), async (req, res) => {
  try {
    const room = await models.Room.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms with pagination
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
 *         description: Number of rooms per page (default is 10)
 *     responses:
 *       200:
 *         description: List of rooms with pagination metadata
 */
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: rooms } = await models.Room.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      rooms
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the room
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Кімната не знайдена
 */
router.get('/:id',authMiddleware,ownerRoomMiddleware('get'), async (req, res) => {
  try {
    const room = await models.Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Кімната не знайдена' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   patch:
 *     summary: Partially update room
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the room to update
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
 *               user_first_id:
 *                 type: integer
 *               user_second_id:
 *                 type: integer
 *               order_id:
 *                 type: integer
 *               number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Кімната не знайдена
 */
router.patch('/:id', authMiddleware,roleMiddleware('customer'),ownerRoomMiddleware('get'), async (req, res) => {
  try {
    const room = await models.Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Кімната не знайдена' });
    }

    const updatedFields = {};
    if (req.body.user_first_id) updatedFields.user_first_id = req.body.user_first_id;
    if (req.body.user_second_id) updatedFields.user_second_id = req.body.user_second_id;
    if (req.body.order_id) updatedFields.order_id = req.body.order_id;
    if (req.body.number) updatedFields.number = req.body.number;

    await room.update(updatedFields);
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete room
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the room to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Room deleted successfully
 *       404:
 *         description: Кімната не знайдена
 */
router.delete('/:id', authMiddleware,roleMiddleware('customer'),ownerRoomMiddleware('get'), async (req, res) => {
  try {
    const room = await models.Room.findByPk(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Кімната не знайдена' });
    }
    await room.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
