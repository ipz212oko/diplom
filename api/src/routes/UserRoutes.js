const express = require('express');
const jwt = require("jsonwebtoken");
const argon2 = require('argon2');
const authMiddleware = require("../middlewares/authMiddleware");
const checkUserIdMiddleware = require("../middlewares/checkUserIdMiddleware");
const uploadPDF = require('../middlewares/uploadPDFMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const isOwnerMiddleware = require('../middlewares/isOwnerMiddleware');
const calculateAverageRating = require('../utils/calculateAverageRating');
const FileService = require('../services/FileService');
const { models } = require("../models");
const { getTokenFromHeader,generateToken } = require("../utils/tokenUtils");
const roleMiddleware = require("../middlewares/roleMiddleware");
const getPaginationParams = require("../utils/pagination");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               region:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 default: customer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', async (req, res) => {
    try {
        const existingUser = await models.User.findOne({
            where: { email: req.body.email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const user = await models.User.create(req.body);
        const token = generateToken(user);

        res.status(201).json({ success: true, token: token });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => err.message);
            res.status(400).json({ message: 'Validation error', details: validationErrors });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination
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
 *         description: Number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: List of users with pagination metadata
 */
router.get('/', authMiddleware,roleMiddleware('admin'), async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);

        const { count, rows: users } = await models.User.findAndCountAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: models.UsersSkill,
                as: 'userSkills',
                include: [{
                    model: models.Skill,
                    as: 'skill'
                }]
            }],
            limit,
            offset
        });

        res.status(200).json({
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            users
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information from JWT
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const  token = getTokenFromHeader(req);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await models.User.findOne({
            attributes: { exclude: ['password'] },
            where: { email: decoded.email },
            include: [{
                model: models.UsersSkill,
                as: 'userSkills',
                include: [{
                    model: models.Skill,
                    as: 'skill'
                }]
            }]
        });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const userInfo = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            region: user.region,
            role: user.role,
            email: user.email,
            image: user.image,
            skills: user.userSkills.map(userSkill => userSkill.skill)
        };

        res.status(200).json(userInfo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: Користувача не знайдено
 */
router.get('/:id',authMiddleware, async (req, res) => {
    try {
        const  token = getTokenFromHeader(req);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await models.User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: models.UsersSkill,
                as: 'userSkills',
                include: [{
                    model: models.Skill,
                    as: 'skill'
                }]
            }]
        });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        if (decoded.role !=='admin' &&user.role === 'admin') {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const transformedUser = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            file: user.file,
            image: user.image,
            description: user.description,
            rating: user.rating,
            skills: user.userSkills.map(userSkill => ({
                id: userSkill.skill.id,
                title: userSkill.skill.title,
                image: userSkill.skill.image,
                description: userSkill.skill.description
            }))
        };
        res.status(200).json(transformedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Partially update user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
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
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               region:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Користувача не знайдено
 */
router.patch('/:id',authMiddleware,checkUserIdMiddleware, async (req, res) => {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        const updatedFields = {};

        if (req.body.name) updatedFields.name = req.body.name;
        if (req.body.region) updatedFields.region = req.body.region;
        if (req.body.surname) updatedFields.surname = req.body.surname;
        if (req.body.email) updatedFields.email = req.body.email;
        if (req.body.password) updatedFields.password = req.body.password;
        if (req.body.description) updatedFields.description = req.body.description;

        await user.update(updatedFields);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: Користувача не знайдено
 */
router.delete('/:id', authMiddleware,checkUserIdMiddleware, async (req, res) => {
    try {
        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}/image:
 *   post:
 *     summary: Upload user profile image
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
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
 *         description: Invalid file or error during upload
 *       404:
 *         description: User not found
 */
router.post('/:id/image',
  authMiddleware,
  checkUserIdMiddleware,
  upload.single('image'),
  async (req, res) => {
      try {
          if (!req.file) {
              return res.status(400).json({ message: 'Файл не завантажено' });
          }

          const fileName = await FileService.uploadImage(req.params.id, req.file);

          res.status(200).json({
              success: true,
              message: 'Зображення успішно завантажено'
          });
      } catch (error) {
          if (error.message === 'Користувача не знайдено') {
              return res.status(404).json({ message: error.message });
          }
          res.status(400).json({ message: error.message });
      }
  }
);

/**
 * @swagger
 * /api/users/{id}/pdf:
 *   post:
 *     summary: Upload user PDF file
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
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
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 *       400:
 *         description: Invalid file or error during upload
 *       404:
 *         description: User not found
 *       413:
 *         description: File too large
 */
router.post('/:id/pdf',
  authMiddleware,
  checkUserIdMiddleware,
  uploadPDF.single('pdf'),
  async (req, res) => {
      try {
          if (!req.file) {
              return res.status(400).json({ message: 'Файл не завантажено' });
          }

          const fileName = await FileService.uploadPDF(req.params.id, req.file);

          res.status(200).json({
              success: true,
              message: 'PDF успішно завантажено',
              fileName: fileName
          });
      } catch (error) {
          if (error.message === 'Користувача не знайдено') {
              return res.status(404).json({ message: error.message });
          }
          res.status(400).json({ message: error.message });
      }
  }
);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current user password
 *               newPassword:
 *                 type: string
 *                 description: New password to set
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of new password
 *     responses:
 *       200:
 *         description: Password successfully changed
 *       400:
 *         description: Invalid password format or passwords don't match
 *       401:
 *         description: Current password is incorrect
 *       400:
 *         description: Server error
 */
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Новий пароль та підтвердження не співпадають'
            });
        }

        const  token = getTokenFromHeader(req);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await models.User.findOne({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const isValidPassword = await argon2.verify(user.password, currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Поточний пароль невірний' });
        }

        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({
                message: 'Новий пароль має містити щонайменше 4 символів'
            });
        }

        await user.update({ password: newPassword });

        const newToken =generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Пароль успішно змінено',
            token: newToken
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/users/{id}/rating:
 *   patch:
 *     summary: Update user rating
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
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
 *               newRating:
 *                 type: number
 *                 format: float
 *                 description: New rating to update
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: User not found
 */
router.patch('/:id/rating', authMiddleware, isOwnerMiddleware, async (req, res) => {
    try {
        const { newRating } = req.body;
        const rating = Number(newRating);

        if (isNaN(rating) || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Рейтинг має бути числом між 0 та 5' });
        }

        const user = await models.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const averageRating = await calculateAverageRating(rating, user.rating);
        const roundedAverageRating = Math.round(averageRating);

        await user.update({ rating: roundedAverageRating });
        res.status(200).json({ success: true, rating: roundedAverageRating });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;
