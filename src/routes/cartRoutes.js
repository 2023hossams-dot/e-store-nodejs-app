const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get user cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب السلة'
    });
  }
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, attributes = {} } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير صحيحة'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'المخزون غير كافي'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    cart.addItem(product, quantity, attributes);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'تم إضافة المنتج إلى السلة',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المنتج'
    });
  }
});

// Remove item from cart
router.post('/remove/:productId', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'السلة غير موجودة'
      });
    }

    cart.removeItem(req.params.productId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج من السلة',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المنتج'
    });
  }
});

// Update item quantity
router.put('/update/:productId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'الكمية يجب أن تكون أكبر من صفر'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'السلة غير موجودة'
      });
    }

    cart.updateItemQuantity(req.params.productId, quantity);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث الكمية',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الكمية'
    });
  }
});

// Clear cart
router.post('/clear', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'السلة غير موجودة'
      });
    }

    cart.clearCart();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'تم تفريغ السلة',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تفريغ السلة'
    });
  }
});

module.exports = router;
