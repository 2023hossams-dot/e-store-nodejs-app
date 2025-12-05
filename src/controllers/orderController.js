const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Create Order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, discountCode } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'السلة فارغة'
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال عنوان الشحن'
      });
    }

    // Validate payment method
    if (!paymentMethod || !paymentMethod.type) {
      return res.status(400).json({
        success: false,
        message: 'يرجى اختيار طريقة الدفع'
      });
    }

    // Check stock and build order items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `المنتج ${item.product} غير موجود`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `المخزون الحالي للمنتج ${product.name} غير كافي`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: product.discountPrice || product.price
      });
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate discount
    let discountAmount = 0;
    if (discountCode) {
      const coupon = await Coupon.findOne({ code: discountCode.toUpperCase() });
      if (coupon && coupon.isValid() && coupon.canBeUsedByUser(req.user.id)) {
        discountAmount = coupon.calculateDiscount(subtotal);
      }
    }

    // Calculate tax (5% for example)
    const tax = (subtotal - discountAmount) * 0.05;

    // Calculate shipping (free for orders above 100)
    const shippingCost = subtotal - discountAmount < 100 ? 10 : 0;

    // Calculate total
    const totalAmount = subtotal - discountAmount + tax + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      discountAmount,
      discountCode,
      tax,
      shippingCost,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress && billingAddress.isSameAsShipping !== true ? billingAddress : shippingAddress,
      paymentMethod
    });

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      );
    }

    // Update coupon usage
    if (discountCode) {
      const coupon = await Coupon.findOne({ code: discountCode.toUpperCase() });
      if (coupon) {
        coupon.usageCount += 1;
        coupon.usedBy.push({ user: req.user.id, usedAt: new Date() });
        await coupon.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطلب'
    });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = { user: req.user.id };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح بالوصول إلى هذا الطلب'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلب'
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح بإلغاء هذا الطلب'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن إلغاء هذا الطلب في الحالة الحالية'
      });
    }

    // Update order status
    order.updateStatus('cancelled', reason);
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity, sold: -item.quantity } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'تم إلغاء الطلب بنجاح',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إلغاء الطلب'
    });
  }
};

// Get All Orders (Admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات'
    });
  }
};

// Update Order Status (Admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, note } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        trackingNumber
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }

    order.updateStatus(status, note);
    await order.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة الطلب'
    });
  }
};
