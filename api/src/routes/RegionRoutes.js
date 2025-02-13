const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/regions:
 *   post:
 *     summary: Create a new region
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alpha2:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *               alpha3:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 3
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Region created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const region = await models.Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Get all regions
 *     responses:
 *       200:
 *         description: List of regions
 */
router.get('/', async (req, res) => {
  try {
    const regions  = await models.Region.findAll();

    res.status(200).json({
      regions
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/regions/{id}:
 *   get:
 *     summary: Get a region by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Region details
 *       404:
 *         description: Region not found
 */
router.get('/:id', async (req, res) => {
  try {
    const region = await models.Region.findByPk(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.status(200).json(region);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/regions/{id}:
 *   patch:
 *     summary: Partially update a region
 *     parameters:
 *       - name: id
 *         in: path
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
 *               alpha2:
 *                 type: string
 *               alpha3:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Region updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Region not found
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const region = await models.Region.findByPk(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    await region.update(req.body);
    res.status(200).json(region);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/regions/{id}:
 *   delete:
 *     summary: Delete a region
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Region deleted successfully
 *       404:
 *         description: Region not found
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const region = await models.Region.findByPk(req.params.id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    await region.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
