const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/order-history:
 *   post:
 *     summary: Create a new order history entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *               time:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Order history entry created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/order-history:
 *   get:
 *     summary: Get all order history entries
 *     responses:
 *       200:
 *         description: List of order history entries
 */
router.get('/', async (req, res) => {
  try {
    const orderHistories = await models.OrderHistory.findAll();
    res.status(200).json(orderHistories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/order-history/{id}:
 *   get:
 *     summary: Get an order history entry by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order history entry
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order history entry details
 *       404:
 *         description: Order history entry not found
 */
router.get('/:id', async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Order history entry not found' });
    }
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/order-history/{id}:
 *   patch:
 *     summary: Partially update order history entry
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order history entry to update
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
 *               order_id:
 *                 type: integer
 *               status_id:
 *                 type: integer
 *               time:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Order history entry updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Order history entry not found
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Order history entry not found' });
    }

    const updatedFields = {};
    if (req.body.order_id) updatedFields.order_id = req.body.order_id;
    if (req.body.status_id) updatedFields.status_id = req.body.status_id;
    if (req.body.time) updatedFields.time = req.body.time;

    await orderHistory.update(updatedFields);
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/order-history/{id}:
 *   delete:
 *     summary: Delete order history entry
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order history entry to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order history entry deleted successfully
 *       404:
 *         description: Order history entry not found
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Order history entry not found' });
    }
    await orderHistory.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
