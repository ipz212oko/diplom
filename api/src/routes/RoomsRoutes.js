const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");

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
router.post('/', authMiddleware, async (req, res) => {
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
 *     summary: Get all rooms
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await models.Room.findAll();
    res.status(200).json(rooms);
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
router.get('/:id',authMiddleware, async (req, res) => {
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
router.patch('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
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
