const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteOldNotifications
} = require('../controllers/notificationController');

// Routes
router.get('/', protect, getNotifications);
router.put('/:notificationId/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:notificationId', protect, deleteNotification);
router.delete('/cleanup/old', protect, deleteOldNotifications); // Admin

module.exports = router;
