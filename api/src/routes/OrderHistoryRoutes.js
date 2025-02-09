const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const getPaginationParams = require("../utils/pagination");
const roleMiddleware = require("../middlewares/roleMiddleware");

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
router.post('/', authMiddleware,roleMiddleware('customer'), async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/order-history:
 *   get:
 *     summary: Get all order history entries with pagination
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
 *         description: Number of order history entries per page (default is 10)
 *     responses:
 *       200:
 *         description: List of order history entries with pagination metadata
 */
router.get('/',  async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: orderHistories } = await models.OrderHistory.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orderHistories
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
 *         description: Запис в історії замовлень не знайдено
 */
router.get('/:id',  async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Запис в історії замовлень не знайдено' });
    }
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
 *     responses:
 *       200:
 *         description: Order history entry updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Запис в історії замовлень не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Запис в історії замовлень не знайдено' });
    }

    const updatedFields = {};
    if (req.body.order_id) updatedFields.order_id = req.body.order_id;
    if (req.body.status_id) updatedFields.status_id = req.body.status_id;

    await orderHistory.update(updatedFields);
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
 *         description: Запис в історії замовлень не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const orderHistory = await models.OrderHistory.findByPk(req.params.id);
    if (!orderHistory) {
      return res.status(404).json({ message: 'Запис в історії замовлень не знайдено' });
    }
    await orderHistory.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
