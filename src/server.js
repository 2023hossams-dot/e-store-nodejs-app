require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

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
const initializeAdmin = require('./config/adminInit');
const connectDB = require('./config/database');

// Routes imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// ==================== DATABASE CONNECTION ====================
// Connect to DB (will skip if MONGODB_URI is not set)
connectDB();

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());
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
app.use('/api/admin', adminRoutes);
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
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] View engine error reading ${filepath}:`, err.message);
      return callback(new Error(`Failed to render view ${filepath}: ${err.message}`));
    }
    try {
      return callback(null, data);
    } catch (e) {
      console.error(`[${new Date().toISOString()}] View engine callback error:`, e.message);
      return callback(e);
    }
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

// Backward-compatible route: some links use `/product-details`
app.get('/product-details', (req, res) => {
  res.render('product-details', {
    title: 'تفاصيل المنتج',
    slug: req.query.slug || null,
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

// Additional pages (services, partnership, loyalty, learning, digital, support)
app.get('/services', (req, res) => {
  res.render('services', {
    title: 'الخدمات - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

app.get('/partnership', (req, res) => {
  res.render('partnership', {
    title: 'الشراكة والتعاون - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

app.get('/loyalty', (req, res) => {
  res.render('loyalty', {
    title: 'برنامج الولاء - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

app.get('/learning', (req, res) => {
  res.render('learning', {
    title: 'الموارد التعليمية - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

app.get('/digital', (req, res) => {
  res.render('digital', {
    title: 'المنتجات الرقمية - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

app.get('/support', (req, res) => {
  res.render('support', {
    title: 'خدمة العملاء والدعم',
    user: req.session.user || null
  });
});

// Wishlist, Categories, Search Results
app.get('/wishlist', (req, res) => {
  res.render('wishlist', {
    title: 'قائمة الرغبات',
    user: req.session.user || null
  });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'الفئات',
    user: req.session.user || null
  });
});

app.get('/search', (req, res) => {
  res.render('search-results', {
    title: 'نتائج البحث',
    user: req.session.user || null
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'من نحن - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'اتصل بنا - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// FAQ page
app.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'الأسئلة الشائعة - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Privacy Policy page
app.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'سياسة الخصوصية - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Terms and Conditions page
app.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'شروط الخدمة - متجرك الإلكتروني',
    user: req.session.user || null
  });
});

// Admin Login page
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-login.html'));
});

// ==================== ERROR HANDLING ====================

// 404 Not Found
app.use(notFound);

// Error Handler
app.use(errorHandler);

// ==================== SERVER START ====================

const DESIRED_PORT = parseInt(process.env.PORT, 10) || 3000;
let server = null;

const startServer = (port, attemptsLeft = 10) => {
  server = app.listen(port);

  server.on('listening', () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 متجرك الإلكتروني');
    console.log('='.repeat(50));
    console.log(`✓ Server يعمل على: http://localhost:${port}`);
    console.log(`✓ البيئة: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ قاعدة البيانات: ${process.env.MONGODB_URI || 'not configured'}`);
    console.log('='.repeat(50) + '\n');
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`⚠️  المنفذ ${port} مستخدم، المحاولة على المنفذ ${port + 1}...`);
      setTimeout(() => startServer(port + 1, attemptsLeft - 1), 300);
    } else {
      console.error('✗ خطأ في بدء الخادم:', err);
      process.exit(1);
    }
  });
};

startServer(DESIRED_PORT, 10);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('Server closed');
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
});

module.exports = app;
