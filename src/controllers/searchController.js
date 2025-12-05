const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    البحث المتقدم عن المنتجات
// @route   GET /api/search/advanced
// @access  Public
exports.advancedSearch = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy,
      page = 1,
      limit = 12,
      tags
    } = req.query;

    let query = { isActive: true };

    // البحث بالنص
    if (q && q.trim()) {
      query.$text = { $search: q };
    }

    // التصفية حسب الفئة
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // التصفية حسب السعر
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // التصفية حسب التقييم
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    // التصفية حسب التوفر
    if (inStock === 'true') {
      query.$expr = { $gt: ['$stock', 0] };
    }

    // التصفية حسب الوسوم
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // الترتيب
    let sortQuery = {};
    switch (sortBy) {
      case 'price_asc':
        sortQuery = { price: 1 };
        break;
      case 'price_desc':
        sortQuery = { price: -1 };
        break;
      case 'rating':
        sortQuery = { 'rating.average': -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      case 'popular':
        sortQuery = { 'rating.count': -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit * 1)
      .select('name slug price rating images stock discount category');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      filters: {
        search: q,
        category,
        priceRange: { min: minPrice, max: maxPrice },
        rating,
        inStock,
        sortBy
      },
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    الحصول على خيارات التصفية
// @route   GET /api/search/filters
// @access  Public
exports.getFilterOptions = async (req, res) => {
  try {
    const { category } = req.query;

    let categoryQuery = {};
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        categoryQuery.category = categoryDoc._id;
      }
    }

    categoryQuery.isActive = true;

    // الحصول على نطاق الأسعار
    const priceStats = await Product.aggregate([
      { $match: categoryQuery },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // الحصول على جميع الفئات
    const categories = await Category.find({ isActive: true })
      .select('name slug');

    // الحصول على جميع الوسوم
    const tags = await Product.distinct('tags', categoryQuery);

    // الحصول على نطاقات التقييم
    const ratings = [
      { label: '⭐⭐⭐⭐⭐', value: 5 },
      { label: '⭐⭐⭐⭐', value: 4 },
      { label: '⭐⭐⭐', value: 3 },
      { label: '⭐⭐', value: 2 },
      { label: '⭐', value: 1 }
    ];

    res.json({
      success: true,
      data: {
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0 },
        categories,
        tags: tags.filter(tag => tag),
        ratings,
        sortOptions: [
          { label: 'الأحدث', value: 'newest' },
          { label: 'الأعلى سعراً', value: 'price_desc' },
          { label: 'الأقل سعراً', value: 'price_asc' },
          { label: 'الأفضل تقييماً', value: 'rating' },
          { label: 'الأكثر شعبية', value: 'popular' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    البحث السريع (مع Suggestions)
// @route   GET /api/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // البحث عن المنتجات والفئات
    const products = await Product.find({
      $text: { $search: q },
      isActive: true
    })
      .select('name slug')
      .limit(5);

    const categories = await Category.find({
      name: { $regex: q, $options: 'i' }
    })
      .select('name slug')
      .limit(3);

    const suggestions = [
      ...products.map(p => ({
        type: 'product',
        name: p.name,
        slug: p.slug
      })),
      ...categories.map(c => ({
        type: 'category',
        name: c.name,
        slug: c.slug
      }))
    ];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    البحث بالصور (Mock)
// @route   POST /api/search/by-image
// @access  Public
exports.searchByImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'يرجى توفير رابط الصورة'
      });
    }

    // في التطبيق الفعلي، يتم استخدام خدمة Vision API أو تقنية التعرف على الصور
    // هنا نستخدم mock data
    const products = await Product.find({ isActive: true })
      .limit(10)
      .select('name slug price rating images');

    res.json({
      success: true,
      message: 'تم البحث بالصورة بنجاح',
      data: products,
      similarity: 'high' // يتم حسابه بناءً على خوارزمية التعرف على الصور
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
