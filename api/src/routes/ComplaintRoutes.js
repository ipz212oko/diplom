const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const getPaginationParams = require("../utils/pagination");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Create a new complaint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const complaint = await models.Complaint.create(req.body);
    res.status(201).json({success: true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Get all complaints with pagination
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
 *         description: Number of complaints per page (default is 10)
 *     responses:
 *       200:
 *         description: List of complaints with pagination metadata
 */
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: complaints } = await models.Complaint.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      complaints
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/complaints/{id}:
 *   get:
 *     summary: Get a complaint by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the complaint
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Complaint details
 *       404:
 *         description: Скарги не знайдено
 */
router.get('/:id', async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Скарги не знайдено' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   patch:
 *     summary: Partially update complaint
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the complaint to update
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
 *               time:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Complaint updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Скарги не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Скарги не знайдено' });
    }

    const updatedFields = {};
    if (req.body.time) updatedFields.time = req.body.time;
    if (req.body.description) updatedFields.description = req.body.description;

    await complaint.update(updatedFields);
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   delete:
 *     summary: Delete complaint
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the complaint to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Complaint deleted successfully
 *       404:
 *         description: Скарги не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Скарги не знайдено' });
    }
    await complaint.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
