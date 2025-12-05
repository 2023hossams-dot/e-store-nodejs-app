const rateLimit = require('express-rate-limit');

// General rate limiter
exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'تم جعل الكثير من الطلبات من هذا العنوان، يرجى المحاولة لاحقاً',
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter (strict)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'عدد محاولات تسجيل الدخول كثير جداً، يرجى المحاولة لاحقاً',
  skipSuccessfulRequests: true
});

// Create order rate limiter
exports.createOrderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 orders per minute
  message: 'عدد الطلبات كثير جداً، يرجى الانتظار قبل إنشاء طلب جديد'
});

// Search rate limiter
exports.searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 searches per minute
  message: 'عدد عمليات البحث كثير جداً، يرجى الانتظار قبل البحث مجدداً'
});
