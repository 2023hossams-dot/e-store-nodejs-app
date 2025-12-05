const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { createOrderLimiter } = require('../middleware/rateLimiter');

// User routes
router.post('/', protect, createOrderLimiter, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/cancel', protect, orderController.cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin'), orderController.getAllOrders);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
