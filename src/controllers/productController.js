const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');

// Get All Products with filters
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    // Build filter
    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sort
    let sortObj = {};
    if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'price-low') sortObj = { price: 1 };
    else if (sort === 'price-high') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { 'rating.average': -1 };
    else sortObj = { createdAt: -1 };

    // Get products
    const products = await Product.find(filter)
      .populate('category')
      .sort(sortObj)
      .limit(limit)
      .skip(skip);

    // Get total count
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات'
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج'
    });
  }
};

// Get Product by Slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج'
    });
  }
};

// Create Product (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, brand, sku, attributes, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      brand,
      sku,
      attributes,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المنتج بنجاح',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المنتج'
    });
  }
};

// Update Product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المنتج'
    });
  }
};

// Delete Product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المنتج'
    });
  }
};

// Get Featured Products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category')
      .limit(8);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات المميزة'
    });
  }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'الفئة غير موجودة'
      });
    }

    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category')
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments({ category: category._id, isActive: true });

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات'
    });
  }
};

// Search Products
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة البحث'
      });
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في البحث'
    });
  }
};
