const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/orders-skills:
 *   post:
 *     summary: Create a new order-skill relation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *               skill_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order-skill relation created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const orderSkill = await models.OrdersSkill.create(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders-skills:
 *   get:
 *     summary: Get all order-skill relations
 *     responses:
 *       200:
 *         description: List of order-skill relations
 */
router.get('/', async (req, res) => {
  try {
    const orderSkills = await models.OrdersSkill.findAll();
    res.status(200).json(orderSkills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders-skills/{id}:
 *   get:
 *     summary: Get an order-skill relation by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order-skill relation
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order-skill relation details
 *       404:
 *         description: Order-skill relation not found
 */
router.get('/:id', async (req, res) => {
  try {
    const orderSkill = await models.OrdersSkill.findByPk(req.params.id);
    if (!orderSkill) {
      return res.status(404).json({ message: 'Order-skill relation not found' });
    }
    res.status(200).json(orderSkill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders-skills/{id}:
 *   patch:
 *     summary: Partially update order-skill relation
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order-skill relation to update
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
 *               skill_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order-skill relation updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Order-skill relation not found
 */
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const orderSkill = await models.OrdersSkill.findByPk(req.params.id);
    if (!orderSkill) {
      return res.status(404).json({ message: 'Order-skill relation not found' });
    }

    const updatedFields = {};
    if (req.body.order_id) updatedFields.order_id = req.body.order_id;
    if (req.body.skill_id) updatedFields.skill_id = req.body.skill_id;

    await orderSkill.update(updatedFields);
    res.status(200).json(orderSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/orders-skills/{id}:
 *   delete:
 *     summary: Delete order-skill relation
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order-skill relation to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order-skill relation deleted successfully
 *       404:
 *         description: Order-skill relation not found
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const orderSkill = await models.OrdersSkill.findByPk(req.params.id);
    if (!orderSkill) {
      return res.status(404).json({ message: 'Order-skill relation not found' });
    }
    await orderSkill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
