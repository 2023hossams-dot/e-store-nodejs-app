const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: String,
        sku: String,
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        discount: {
          type: Number,
          default: 0
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    discountCode: String,
    tax: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      email: String,
      phone: String,
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String,
      zip: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    billingAddress: {
      isSameAsShipping: {
        type: Boolean,
        default: true
      },
      fullName: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet'],
        required: true
      },
      lastFour: String,
      cardBrand: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
      index: true
    },
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    cancellationReason: String,
    cancelledAt: Date,
    returnRequest: {
      requested: Boolean,
      reason: String,
      requestedAt: Date,
      approvedAt: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
      }
    },
    notes: String,
    internalNotes: String,
    timelineEvents: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        note: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
    
    // Add initial timeline event
    this.timelineEvents.push({
      status: 'pending',
      note: 'تم إنشاء الطلب'
    });
  }
  next();
});

// Method to calculate total amount
orderSchema.methods.calculateTotal = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  this.totalAmount = this.subtotal - this.discountAmount + this.tax + this.shippingCost;
  return this.totalAmount;
};

// Method to update status
orderSchema.methods.updateStatus = function (newStatus, note) {
  this.status = newStatus;
  this.timelineEvents.push({
    status: newStatus,
    note: note || `تم تغيير الحالة إلى ${newStatus}`
  });
};

module.exports = mongoose.model('Order', orderSchema);
