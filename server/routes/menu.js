// routes/menu.js
const express = require('express');
const { body } = require('express-validator');
const {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getMenu);
router.get('/:id', getMenuItem);

// Protected (admin) routes
router.post(
  '/',
  protect,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').optional(),
    body('imageUrl').optional().isURL(),
  ],
  createMenuItem
);

router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;
