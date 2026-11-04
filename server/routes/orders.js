// routes/orders.js
const express = require('express');
const { body } = require('express-validator');
const {
  getMyOrders,
  getAllOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my', protect, getMyOrders);       // student's own orders
router.get('/', protect, getAllOrders);          // all orders (admin)

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.menuItem').isMongoId().withMessage('Invalid menu item ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  createOrder
);

router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
