const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { models } = require("../models");
const { getTokenFromHeader } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, text } = req.body;
    const token = getTokenFromHeader(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender_id =decoded.id;
    const sendtime = new Date().toISOString();

    const comment = await models.Comment.create({ user_id, text, sender_id, sendtime });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments with pagination
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
 *         description: Number of comments per page (default is 10)
 *     responses:
 *       200:
 *         description: List of comments with pagination metadata
 */
router.get('/', async (req, res) => {
  try {
    const comments = await models.Comment.findAll();

    res.status(200).json({
      comments
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment details
 *       404:
 *         description: Коментар не знайдено
 */
router.get('/:id', async (req, res) => {
  try {
    const comment = await models.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Коментар не знайдено' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: Partially update comment
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to update
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
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Коментар не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const comment = await models.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Коментар не знайдено' });
    }
    const updatedFields = {};
    if (req.body.text) updatedFields.text = req.body.text;
    await comment.update(updatedFields);
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Коментар не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const comment = await models.Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Коментар не знайдено' });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
