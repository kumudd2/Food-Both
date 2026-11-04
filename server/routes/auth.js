// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  registerUser
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  loginUser
);

router.get('/me', protect, getMe);

module.exports = router;
