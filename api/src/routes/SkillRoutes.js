const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const FileService = require('../services/FileService');
const upload = require('../middlewares/uploadMiddleware');
const { models } = require("../models");

const router = express.Router();

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     responses:
 *       200:
 *         description: List of skills
 */
router.get('/', async (req, res) => {
  try {
    const  skills  = await models.Skill.findAll();

    res.status(200).json({
      skills
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const skill = await models.Skill.create(req.body);
    res.status(201).json({success:true});
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
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
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Навички не знайдено
 */
router.patch('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const skill = await models.Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Навички не знайдено' });
    }

    const updatedFields = {};
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;

    await skill.update(updatedFields);
    res.status(200).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
router.delete('/:id', authMiddleware,roleMiddleware('admin'), async (req, res) => {
  try {
    const skill = await models.Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Навички не знайдено' });
    }
    await skill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/skills/{id}/image:
 *   post:
 *     summary: Upload skill image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the skill
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Навичку не знайдено
 */
router.post('/:id/image',
  authMiddleware,
  roleMiddleware('admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'Будь ласка, завантажте зображення'
        });
      }

      const skillId = req.params.id;
      const fileName = await FileService.uploadSkillImage(skillId, req.file);

      res.status(200).json({
        success: true
      });
    } catch (error) {
      res.status(error.message === 'Навичку не знайдено' ? 404 : 400)
      .json({ message: error.message });
    }
  });

/**
 * @swagger
 * /api/skills/{id}/image:
 *   delete:
 *     summary: Delete skill image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the skill
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Навичку не знайдено
 *       400:
 *         description: Error during deletion
 */
router.delete('/:id/image',
  authMiddleware,
  roleMiddleware('admin'),
  async (req, res) => {
    try {
      await FileService.deleteSkillImage(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Зображення навички успішно видалено'
      });
    } catch (error) {
      res.status(error.message === 'Навичку не знайдено' ? 404 : 400)
      .json({ message: error.message });
    }
  }
);

module.exports = router;
