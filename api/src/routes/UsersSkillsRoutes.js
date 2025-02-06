const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const { models } = require("../models");
const getPaginationParams = require("../utils/pagination");

const router = express.Router();

/**
 * @swagger
 * /api/users-skills:
 *   post:
 *     summary: Add a new skill to a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               skill_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: UsersSkill created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {

    const skill = await models.Skill.findByPk(req.body.skill_id);
    if (!skill) {
      return res.status(400).json({ error: 'Навичка не знайдена' });
    }
    const user = await models.Skill.findByPk(req.body.user_id);
    if (!user) {
      return res.status(400).json({ error: 'Користувача не знайдено' });
    }
    const usersSkill = await models.UsersSkill.create({ user_id:user.id, skill_id:skill.id });

    res.status(201).json({success:true});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users-skills:
 *   get:
 *     summary: Get all users' skills with pagination
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
 *         description: Number of users' skills per page (default is 10)
 *     responses:
 *       200:
 *         description: List of users' skills with pagination metadata
 */
router.get('/', async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows: usersSkills } = await models.UsersSkill.findAndCountAll({
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      usersSkills
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


/**
 * @swagger
 * /api/users-skills/{id}:
 *   get:
 *     summary: Get a users-skill entry by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the users-skill entry
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users-skill details
 *       404:
 *         description: Users-skill not found
 */
router.get('/:id', async (req, res) => {
  try {
    const usersSkill = await models.UsersSkill.findByPk(req.params.id);
    if (!usersSkill) {
      return res.status(404).json({ message: 'UsersSkill не знайдено' });
    }
    res.status(200).json(usersSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users-skills/{id}:
 *   patch:
 *     summary: Partially update users-skill entry
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the users-skill entry to update
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
 *               user_id:
 *                 type: integer
 *               skill_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: UsersSkill updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: UsersSkill не знайдено
 */
router.patch('/:id', authMiddleware,async (req, res) => {
  try {
    const usersSkill = await models.UsersSkill.findByPk(req.params.id);
    if (!usersSkill) {
      return res.status(404).json({ message: 'UsersSkill не знайдено' });
    }

    const updatedFields = {};
    if (req.body.user_id) updatedFields.user_id = req.body.user_id;
    if (req.body.skill_id) updatedFields.skill_id = req.body.skill_id;

    await usersSkill.update(updatedFields);
    res.status(200).json(usersSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users-skills/{id}:
 *   delete:
 *     summary: Delete a users-skill entry
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the users-skill entry to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: UsersSkill deleted successfully
 *       404:
 *         description: UsersSkill не знайдено
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const usersSkill = await models.UsersSkill.findByPk(req.params.id);
    if (!usersSkill) {
      return res.status(404).json({ message: 'UsersSkill не знайдено' });
    }
    await usersSkill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
