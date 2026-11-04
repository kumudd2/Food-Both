// routes/inventory.js
const express = require('express');
const { body } = require('express-validator');
const {
  getInventory,
  upsertInventory,
  updateStock,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getInventory);

router.post(
  '/',
  protect,
  [
    body('menuItem').isMongoId().withMessage('Valid menu item ID required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be >= 0'),
    body('threshold').optional().isInt({ min: 0 }),
  ],
  upsertInventory
);

router.patch('/:id', protect, updateStock);

module.exports = router;
