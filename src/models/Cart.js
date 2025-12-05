const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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
        price: {
          type: Number,
          required: true
        },
        discountPrice: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        attributes: {
          size: String,
          color: String
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    appliedCoupon: {
      code: String,
      discountAmount: Number,
      discountPercentage: Number,
      expiresAt: Date
    },
    subtotal: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Calculate totals
cartSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  this.discountAmount = this.appliedCoupon ? this.appliedCoupon.discountAmount : 0;
  this.total = this.subtotal - this.discountAmount + this.tax + this.shippingCost;

  return {
    subtotal: this.subtotal,
    discountAmount: this.discountAmount,
    tax: this.tax,
    shippingCost: this.shippingCost,
    total: this.total
  };
};

// Add item to cart
cartSchema.methods.addItem = function (product, quantity = 1, attributes = {}) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === product._id.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      attributes
    });
  }

  this.lastUpdated = new Date();
  return this.calculateTotals();
};

// Remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((item) => item.product.toString() !== productId.toString());
  this.lastUpdated = new Date();
  return this.calculateTotals();
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find((item) => item.product.toString() === productId.toString());
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      return this.removeItem(productId);
    }
    this.lastUpdated = new Date();
    return this.calculateTotals();
  }
  return null;
};

// Clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.appliedCoupon = null;
  this.calculateTotals();
};

module.exports = mongoose.model('Cart', cartSchema);
