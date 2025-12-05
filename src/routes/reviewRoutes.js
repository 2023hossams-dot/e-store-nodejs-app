const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const {
  createReview,
  getProductReviews,
  markHelpful,
  deleteReview
} = require('../controllers/reviewController');

// Validation middleware
const reviewValidation = [
  body('title').trim().notEmpty().withMessage('يرجى إدخال عنوان التقييم'),
  body('comment').trim().notEmpty().withMessage('يرجى إدخال تعليقك'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('يجب أن يكون التقييم من 1 إلى 5')
];

// Routes
router.post('/', protect, reviewValidation, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:reviewId/helpful', protect, markHelpful);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
