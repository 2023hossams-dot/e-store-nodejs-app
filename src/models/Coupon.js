const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'يرجى إدخال كود الخصم'],
      unique: true,
      uppercase: true,
      index: true
    },
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: [true, 'يرجى إدخال قيمة الخصم'],
      min: 0
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: Number,
    usageLimit: {
      total: {
        type: Number,
        default: null
      },
      perUser: {
        type: Number,
        default: 1
      }
    },
    usageCount: {
      type: Number,
      default: 0
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        usedAt: Date
      }
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.usageLimit.total === null || this.usageCount < this.usageLimit.total)
  );
};

// Check if user can use this coupon
couponSchema.methods.canBeUsedByUser = function (userId) {
  const userUsage = this.usedBy.filter((usage) => usage.user.toString() === userId.toString());
  return userUsage.length < this.usageLimit.perUser;
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid()) return 0;
  if (orderAmount < this.minOrderAmount) return 0;

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }

  if (this.maxDiscount) {
    discount = Math.min(discount, this.maxDiscount);
  }

  return Math.min(discount, orderAmount);
};

module.exports = mongoose.model('Coupon', couponSchema);
