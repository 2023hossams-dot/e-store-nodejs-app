const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    إنشاء تقييم جديد
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { productId, title, comment, rating } = req.body;
    const userId = req.user.id;

    // تحقق من وجود المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
    }

    // تحقق من أن المستخدم قام بشراء المنتج
    const order = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered'
    });

    // تحقق من عدم وجود تقييم سابق
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'لقد قمت بتقييم هذا المنتج بالفعل' 
      });
    }

    // إنشاء التقييم
    const review = await Review.create({
      product: productId,
      user: userId,
      order: order ? order._id : null,
      title,
      comment,
      rating,
      verified: !!order
    });

    // تحديث تقييم المنتج
    await product.updateRating();

    res.status(201).json({
      success: true,
      message: 'تم إضافة التقييم بنجاح',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    الحصول على تقييمات المنتج
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ helpful: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      product: productId,
      status: 'approved'
    });

    res.json({
      success: true,
      data: reviews,
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

// @desc    تحديث مفيد التقييم
// @route   PUT /api/reviews/:reviewId/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
    }

    // تحقق من عدم تكرار المستخدم
    if (review.helpful.users.includes(userId)) {
      review.helpful.users.pull(userId);
      review.helpful.count--;
    } else {
      review.helpful.users.push(userId);
      review.helpful.count++;
    }

    await review.save();

    res.json({
      success: true,
      message: 'تم تحديث التقييم',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    حذف التقييم
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'التقييم غير موجود' });
    }

    // تحقق من أن المستخدم هو المالك
    if (review.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذا التقييم' });
    }

    const product = await Product.findById(review.product);
    await Review.findByIdAndDelete(reviewId);

    // تحديث تقييم المنتج
    if (product) {
      await product.updateRating();
    }

    res.json({
      success: true,
      message: 'تم حذف التقييم بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
