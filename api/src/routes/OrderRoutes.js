const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const getPaginationParams = require("../utils/pagination");
const roleMiddleware = require("../middlewares/roleMiddleware");
const ownerOrderMiddleware = require("../middlewares/ownerOrderMiddleware");
const { getTokenFromHeader } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");

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
 *             required:
 *               - user_id
 *               - status_id
 *               - title
 *               - price
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID користувача, який створює замовлення
 *               status_id:
 *                 type: integer
 *                 description: ID статусу замовлення
 *               title:
 *                 type: string
 *                 description: Назва замовлення
 *               price:
 *                 type: number
 *                 description: Вартість замовлення
 *               region:
 *                 type: integer
 *                 description: Регіон виконання (необов'язково)
 *               worktime:
 *                 type: string
 *                 format: date
 *                 description: Дата виконання (необов'язково)
 *               description:
 *                 type: string
 *                 description: Опис замовлення (необов'язково)
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,roleMiddleware('customer'),  async (req, res) => {
  try {
    const  token = getTokenFromHeader(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.id !==req.body.user_id){
      return res.status(403).json({ message: 'У вас немає доступу до цього ресурсу' });
    }

    const order = await models.Order.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with pagination
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
 *         description: Number of orders per page (default is 10)
 *     responses:
 *       200:
 *         description: List of orders with pagination metadata
 */
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: orders } = await models.Order.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      orders
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
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
 *                 type: integer
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
router.patch('/:id', authMiddleware,roleMiddleware('customer'),ownerOrderMiddleware('order'), async (req, res) => {
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
    res.status(400).json({ message: error.message });
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
router.delete('/:id', authMiddleware,roleMiddleware('customer'),ownerOrderMiddleware('order'), async (req, res) => {
  try {
    const order = await models.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }
    await order.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{orderId}/skills/{skillId}:
 *   post:
 *     summary: Додавання зв'язку замовлення та навички
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: ID замовлення
 *         required: true
 *         schema:
 *           type: integer
 *       - name: skillId
 *         in: path
 *         description: ID навички
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Зв'язок успішно створено
 *       409:
 *         description: Зв'язок уже існує
 *       400:
 *         description: Невірний запит
 */
router.post('/:orderId/skills/:skillId', authMiddleware, roleMiddleware('customer'),ownerOrderMiddleware('order'),  async (req, res) => {
  try {
    const { orderId, skillId } = req.params;

    const existingOrderSkill = await models.OrdersSkill.findOne({
      where: { order_id: orderId, skill_id: skillId }
    });

    if (existingOrderSkill) {
      return res.status(409).json({ message: 'Зв\'язок замовлення і навички вже існує' });
    }

    const newOrderSkill = await models.OrdersSkill.create({
      order_id: orderId,
      skill_id: skillId
    });

    res.status(201).json(newOrderSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/orders/{orderId}/skills/{skillId}:
 *   delete:
 *     summary: Видалення зв'язку замовлення та навички
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: ID замовлення
 *         required: true
 *         schema:
 *           type: integer
 *       - name: skillId
 *         in: path
 *         description: ID навички
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Зв'язок успішно видалено
 *       404:
 *         description: Зв'язок не знайдено
 *       400:
 *         description: Невірний запит
 */
router.delete('/:orderId/skills/:skillId', authMiddleware, roleMiddleware('customer'),ownerOrderMiddleware('order'),  async (req, res) => {
  try {
    const { orderId, skillId } = req.params;

    const orderSkill = await models.OrdersSkill.findOne({
      where: { order_id: orderId, skill_id: skillId }
    });

    if (!orderSkill) {
      return res.status(404).json({ message: 'Зв\'язок замовлення і навички не знайдено' });
    }

    await orderSkill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
