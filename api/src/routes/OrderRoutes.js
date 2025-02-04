const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               region:
 *                 type: string
 *               worktime:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const order = await models.Order.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', async (req, res) => {
  try {
    const orders = await models.Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Замовлення не знайдено
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await models.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Partially update order
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order to update
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
 *               status_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               region:
 *                 type: string
 *               worktime:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Замовлення не знайдено
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await models.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    const updatedFields = {};
    if (req.body.status_id) updatedFields.status_id = req.body.status_id;
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.price) updatedFields.price = req.body.price;
    if (req.body.region) updatedFields.region = req.body.region;
    if (req.body.worktime) updatedFields.worktime = req.body.worktime;
    if (req.body.description) updatedFields.description = req.body.description;

    await order.update(updatedFields);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Замовлення не знайдено
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await models.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }
    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
