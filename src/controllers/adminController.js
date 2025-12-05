const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const path = require('path');

// Generate JWT Token
const generateAdminToken = (id, role) => {
  return jwt.sign({ id, role, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Get Admin Login Page
exports.getAdminLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin-login.html'));
};

// Admin Login
exports.adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم وكلمة المرور'
      });
    }

    // Get admin with password field
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'بيانات دخول غير صحيحة'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'حسابك غير مفعل'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(401).json({
        success: false,
        message: 'حسابك مقفل مؤقتاً، يرجى المحاولة لاحقاً'
      });
    }

    // Check password
    const isPasswordCorrect = await admin.matchPassword(password);
    if (!isPasswordCorrect) {
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      await admin.save();
      return res.status(401).json({
        success: false,
        message: 'بيانات دخول غير صحيحة'
      });
    }

    // Reset login attempts
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id, admin.role);

    // Log activity
    await admin.logActivity(
      'LOGIN',
      'تسجيل دخول المشرف',
      req.ip,
      req.get('user-agent')
    );

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول'
    });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات المشرف'
    });
  }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const { email, fullName, phone } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      {
        email,
        fullName,
        phone
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await admin.logActivity(
      'UPDATE_PROFILE',
      'تحديث الملف الشخصي',
      req.ip,
      req.get('user-agent')
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الملف الشخصي'
    });
  }
};

// Change Admin Password
exports.changeAdminPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const admin = await Admin.findById(req.admin.id).select('+password');

    // Verify old password
    const isPasswordCorrect = await admin.matchPassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'كلمات المرور الجديدة غير متطابقة'
      });
    }

    admin.password = newPassword;
    await admin.save();

    // Log activity
    await admin.logActivity(
      'CHANGE_PASSWORD',
      'تغيير كلمة المرور',
      req.ip,
      req.get('user-agent')
    );

    res.status(200).json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تغيير كلمة المرور'
    });
  }
};

// Admin Logout
exports.adminLogout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });
};

// Get Dashboard Stats
exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = 0; // Will update when Orders model is ready

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات لوحة التحكم'
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      };
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين'
    });
  }
};

// Get User By ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات المستخدم'
    });
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات المستخدم بنجاح',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث بيانات المستخدم'
    });
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المستخدم'
    });
  }
};

// Get All Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ]
      };
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
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

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة المنتج'
    });
  }
};

// Update Product
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

// Delete Product
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

// Get All Admins
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password');

    res.status(200).json({
      success: true,
      admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المشرفين'
    });
  }
};

// Create Admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { username, email, password, fullName, phone, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم أو البريد الإلكتروني مسجل بالفعل'
      });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      fullName,
      phone,
      role,
      permissions
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حساب المشرف بنجاح',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء حساب المشرف'
    });
  }
};

// Update Admin
exports.updateAdmin = async (req, res, next) => {
  try {
    const { email, fullName, phone, role, permissions, isActive } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        email,
        fullName,
        phone,
        role,
        permissions,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'المشرف غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات المشرف بنجاح',
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث بيانات المشرف'
    });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'المشرف غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف المشرف بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المشرف'
    });
  }
};

module.exports = exports;
