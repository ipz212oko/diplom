const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,roleMiddleware, async (req, res) => {
  try {
    const skill = await models.Skill.create(req.body);
    res.status(201).json({success:true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get('/',  async (req, res) => {
  try {
    const skills = await models.Skill.findAll();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get a skill by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the skill
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill details
 *       404:
 *         description: Навички не знайдено
 */
router.get('/:id', async (req, res) => {
  try {
    const skill = await models.Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Навички не знайдено' });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   patch:
 *     summary: Partially update skill
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the skill to update
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
 *               rating:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Навички не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware, async (req, res) => {
  try {
    const skill = await models.Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Навички не знайдено' });
    }

    const updatedFields = {};
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.rating) updatedFields.rating = req.body.rating;

    await skill.update(updatedFields);
    res.status(200).json(skill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete skill
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the skill to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Skill deleted successfully
 *       404:
 *         description: Навички не знайдено
 */
router.delete('/:id', authMiddleware,roleMiddleware, async (req, res) => {
  try {
    const skill = await models.Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Навички не знайдено' });
    }
    await skill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
