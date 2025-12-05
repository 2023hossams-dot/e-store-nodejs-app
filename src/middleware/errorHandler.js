const { validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'أخطاء في التحقق من البيانات',
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg
      }))
    });
  }
  next();
};

// Custom error handling middleware
exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'حدث خطأ في السيرفر';

  console.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 Not Found middleware
exports.notFound = (req, res, next) => {
  const error = new Error(`لم يتم العثور على المسار - ${req.originalUrl}`);
  // attach a 404 status to the error so the error handler can use it
  error.status = 404;
  res.status(404);
  next(error);
};

// Async error wrapper
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
