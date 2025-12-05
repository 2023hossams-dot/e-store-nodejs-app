const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    الحصول على إشعارات المستخدم
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const unreadOnly = req.query.unread === 'true';

    let query = { user: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countUnread(userId);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    تحديد إشعار كمقروء
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    if (notification.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك برؤية هذا الإشعار'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'تم تحديث الإشعار',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    تحديد جميع الإشعارات كمقروءة
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: 'تم تحديث جميع الإشعارات'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    حذف إشعار
// @route   DELETE /api/notifications/:notificationId
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'الإشعار غير موجود'
      });
    }

    if (notification.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا الإشعار'
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({
      success: true,
      message: 'تم حذف الإشعار بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    إنشاء إشعار (للاستخدام الداخلي)
// @access  Internal
exports.createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data
    });
    return notification;
  } catch (error) {
    console.error('خطأ في إنشاء الإشعار:', error);
  }
};

// @desc    حذف الإشعارات القديمة
// @route   DELETE /api/notifications/cleanup/old
// @access  Admin
exports.deleteOldNotifications = async (req, res) => {
  try {
    const daysOld = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: `تم حذف ${result.deletedCount} إشعار قديم`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
