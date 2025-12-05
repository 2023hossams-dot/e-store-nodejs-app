const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'يرجى تسجيل الدخول أولاً'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'توكن غير صحيح أو منتهي الصلاحية'
    });
  }
};

// Middleware to check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'أنت غير مصرح بالوصول إلى هذا المورد'
      });
    }
    next();
  };
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'هذا المورد مخصص للمسؤولين فقط'
    });
  }
};

// Middleware to check if user is authenticated
exports.isAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'يرجى تسجيل الدخول'
    });
  }
};

// Middleware to make token optional
exports.optionalAuth = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token is invalid, but we continue
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Middleware to verify Admin JWT token
exports.protectAdmin = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } else if (req.headers['x-admin-token']) {
    token = req.headers['x-admin-token'];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'يرجى تسجيل الدخول كمشرف أولاً'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (!decoded.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'هذا التوكن غير صحيح للمشرفين'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'توكن غير صحيح أو منتهي الصلاحية'
    });
  }
};

// Middleware to check admin permissions
exports.isAdmin = (permission) => {
  return async (req, res, next) => {
    try {
      const Admin = require('../models/Admin');
      const admin = await Admin.findById(req.admin.id);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'المشرف غير موجود'
        });
      }

      // Check if super_admin (has all permissions)
      if (admin.role === 'super_admin') {
        return next();
      }

      // Check if has specific permission
      if (permission && !admin.permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: 'أنت غير مصرح بالقيام بهذه العملية'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'خطأ في التحقق من الصلاحيات'
      });
    }
  };
};
