const User = require('../models/User');
const Product = require('../models/Product');

// @desc    الحصول على المفضلة
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: 'wishlist',
      select: 'name slug price images rating discount stock'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: user.wishlist,
      count: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    إضافة منتج للمفضلة
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // تحقق من وجود المنتج
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // تحقق من وجود المستخدم
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // تحقق من عدم وجود المنتج بالفعل
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'المنتج موجود بالفعل في المفضلة'
      });
    }

    // إضافة المنتج
    user.wishlist.push(productId);
    await user.save();

    res.json({
      success: true,
      message: 'تم إضافة المنتج للمفضلة',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    حذف منتج من المفضلة
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'المنتج غير موجود في المفضلة'
      });
    }

    user.wishlist.pull(productId);
    await user.save();

    res.json({
      success: true,
      message: 'تم حذف المنتج من المفضلة',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    التحقق من وجود منتج في المفضلة
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.isInWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.json({
      success: true,
      isInWishlist,
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    مسح المفضلة
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'تم مسح المفضلة'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
