require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Middleware imports
const { generalLimiter } = require('./middleware/rateLimiter');
const { 
  requestLogger, 
  sanitizeInput, 
  corsHeaders, 
  securityHeaders 
} = require('./middleware/security');
const { 
  errorHandler, 
  notFound, 
  handleValidationErrors 
} = require('./middleware/errorHandler');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// ==================== DATABASE CONNECTION ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB متصل بنجاح');
  } catch (error) {
    console.error('✗ خطأ في الاتصال بـ MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(corsHeaders);
app.use(securityHeaders);

// CORS
app.use(cors({
  origin: process.env.APP_DOMAIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(generalLimiter);

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static Files
app.use(express.static(path.join(__dirname, '../public')));

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ==================== STATIC FILES ====================

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// View Engine Setup
app.set('view engine', 'html');
app.engine('html', (filepath, options, callback) => {
  const fs = require('fs');
  fs.readFile(filepath, (err, data) => {
    if (err) return callback(err);
    return callback(null, data.toString());
  });
});
app.set('views', path.join(__dirname, '../views'));

// Home page
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'الصفحة الرئيسية - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Products page
app.get('/products', (req, res) => {
  res.render('products', { 
    title: 'المنتجات - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Product details page
app.get('/products/:slug', (req, res) => {
  res.render('product-details', { 
    title: 'تفاصيل المنتج',
    slug: req.params.slug,
    user: req.session.user || null
  });
});

// Cart page
app.get('/cart', (req, res) => {
  res.render('cart', { 
    title: 'سلة التسوق',
    user: req.session.user || null
  });
});

// Checkout page
app.get('/checkout', (req, res) => {
  res.render('checkout', { 
    title: 'الدفع',
    user: req.session.user || null
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { 
    title: 'تسجيل الدخول',
    user: req.session.user || null
  });
});

// Register page
app.get('/register', (req, res) => {
  res.render('register', { 
    title: 'التسجيل',
    user: req.session.user || null
  });
});

// Account page
app.get('/account', (req, res) => {
  res.render('account', { 
    title: 'حسابي',
    user: req.session.user || null
  });
});

// Orders page
app.get('/orders', (req, res) => {
  res.render('orders', { 
    title: 'طلباتي',
    user: req.session.user || null
  });
});

// ==================== ERROR HANDLING ====================

// 404 Not Found
app.use(notFound);

// Error Handler
app.use(errorHandler);

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 متجرك الإلكتروني');
  console.log('='.repeat(50));
  console.log(`✓ Server يعمل على: http://localhost:${PORT}`);
  console.log(`✓ البيئة: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ قاعدة البيانات: ${process.env.MONGODB_URI}`);
  console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
