const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'يرجى إدخال اسم المنتج'],
      trim: true,
      maxlength: [100, 'اسم المنتج لا يمكن أن يتجاوز 100 أحرف'],
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'يرجى إدخال وصف المنتج']
    },
    shortDescription: {
      type: String,
      maxlength: 250
    },
    price: {
      type: Number,
      required: [true, 'يرجى إدخال سعر المنتج'],
      min: [0, 'السعر يجب أن يكون موجب']
    },
    discountPrice: {
      type: Number,
      min: [0, 'سعر الخصم يجب أن يكون موجب']
    },
    discountPercentage: {
      type: Number,
      min: [0, 'نسبة الخصم يجب أن تكون بين 0 و 100'],
      max: [100, 'نسبة الخصم يجب أن تكون بين 0 و 100']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    brand: {
      type: String,
      trim: true
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false
        }
      }
    ],
    stock: {
      type: Number,
      required: [true, 'يرجى إدخال عدد المخزون'],
      min: [0, 'المخزون لا يمكن أن يكون سالب'],
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'التقييم يجب أن يكون بين 0 و 5'],
        max: [5, 'التقييم يجب أن يكون بين 0 و 5']
      },
      count: {
        type: Number,
        default: 0
      }
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        title: String,
        comment: String,
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        helpful: {
          type: Number,
          default: 0
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    attributes: {
      size: [String],
      color: [String],
      weight: String,
      dimension: {
        length: Number,
        width: Number,
        height: Number
      }
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    keywords: [String],
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'rating.average': -1 });

// Auto-calculate slug
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  }
  next();
});

// Calculate discount price
productSchema.pre('save', function (next) {
  if (this.discountPercentage) {
    this.discountPrice = this.price - (this.price * this.discountPercentage) / 100;
  }
  next();
});

// Method to check if in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.stock >= quantity;
};

// Method to get discount info
productSchema.methods.getDiscount = function () {
  return {
    percentage: this.discountPercentage || 0,
    price: this.discountPrice || this.price,
    savings: this.price - (this.discountPrice || this.price)
  };
};

module.exports = mongoose.model('Product', productSchema);
