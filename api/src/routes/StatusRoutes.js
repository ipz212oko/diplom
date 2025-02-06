const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/statuses:
 *   post:
 *     summary: Create a new status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const status = await models.Status.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/statuses:
 *   get:
 *     summary: Get all statuses
 *     responses:
 *       200:
 *         description: List of statuses
 */
router.get('/',authMiddleware, async (req, res) => {
  try {
    const statuses = await models.Status.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/statuses/{id}:
 *   get:
 *     summary: Get a status by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the status
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status details
 *       404:
 *         description: Статус не знайдено
 */
router.get('/:id',authMiddleware, async (req, res) => {
  try {
    const status = await models.Status.findByPk(req.params.id);
    if (!status) {
      return res.status(404).json({ message: 'Статус не знайдено' });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/statuses/{id}:
 *   patch:
 *     summary: Partially update status
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the status to update
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Статус не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const status = await models.Status.findByPk(req.params.id);
    if (!status) {
      return res.status(404).json({ message: 'Статус не знайдено' });
    }

    const updatedFields = {};
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;

    await status.update(updatedFields);
    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/statuses/{id}:
 *   delete:
 *     summary: Delete status
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the status to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Status deleted successfully
 *       404:
 *         description: Статус не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const status = await models.Status.findByPk(req.params.id);
    if (!status) {
      return res.status(404).json({ message: 'Статус не знайдено' });
    }
    await status.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
