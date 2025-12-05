const mongoose = require('mongoose');
const initializeAdmin = require('./adminInit');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI غير معرف — سيتم تجاوز الاتصال بقاعدة البيانات (مفيد للاختبار المحلي).');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB متصل بنجاح');

    // Initialize default admin if applicable
    if (typeof initializeAdmin === 'function') {
      try {
        await initializeAdmin();
      } catch (err) {
        console.warn('⚠️ خطأ أثناء تهيئة المشرف الافتراضي:', err.message);
      }
    }

    return conn;
  } catch (error) {
    console.error('✗ خطأ في الاتصال بـ MongoDB:', error.message);
    // Do not exit process here to allow dev/test without DB
    return null;
  }
};

module.exports = connectDB;
