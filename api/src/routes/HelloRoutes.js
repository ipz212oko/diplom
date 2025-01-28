
const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Returns a Hello World message
 *     responses:
 *       200:
 *         description: A Hello World message
 */
router.get('/',authMiddleware, (req, res) => {
    res.send('Hello, World!');
});


module.exports = router;