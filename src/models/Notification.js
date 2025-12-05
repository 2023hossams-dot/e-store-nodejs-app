const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['order', 'product', 'promotion', 'review', 'account', 'system'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '📢'
    },
    link: {
      type: String,
      default: null
    },
    data: {
      orderId: mongoose.Schema.Types.ObjectId,
      productId: mongoose.Schema.Types.ObjectId,
      reviewId: mongoose.Schema.Types.ObjectId
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    actions: [
      {
        label: String,
        url: String,
        type: {
          type: String,
          enum: ['primary', 'secondary']
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index untuk pencarian cepat
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

// Method untuk tandai sebagai baca
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Statis untuk hitung notifikasi belum dibaca
notificationSchema.statics.countUnread = function (userId) {
  return this.countDocuments({ user: userId, read: false });
};

module.exports = mongoose.model('Notification', notificationSchema);
