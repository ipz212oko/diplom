const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
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
 *     summary: Get all complaints
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/', async (req, res) => {
  try {
    const complaints = await models.Complaint.findAll();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
 *         description: Complaint not found
 */
router.get('/:id', async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
 *         description: Complaint not found
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
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
 *         description: Complaint not found
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await models.Complaint.findByPk(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    await complaint.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
