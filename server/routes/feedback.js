// routes/feedback.js
const express = require('express');
const { body } = require('express-validator');
const {
  getAllFeedback,
  submitFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllFeedback);

router.post(
  '/',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().isString(),
  ],
  submitFeedback
);

router.delete('/:id', protect, deleteFeedback);

module.exports = router;
