const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
} = require('../controllers/wishlistController');

// Routes
router.get('/', protect, getWishlist);
router.post('/:productId', protect, addToWishlist);
router.delete('/:productId', protect, removeFromWishlist);
router.get('/check/:productId', protect, isInWishlist);
router.delete('/', protect, clearWishlist);

module.exports = router;
