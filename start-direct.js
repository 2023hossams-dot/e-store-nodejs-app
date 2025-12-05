#!/usr/bin/env node

/**
 * 🚀 متجر إلكتروني - بدء التشغيل المباشر
 */

require('dotenv').config();
const app = require('./src/server.js');

console.log('\n' + '='.repeat(60));
console.log('🎉 تم تشغيل الخادم بنجاح!');
console.log('='.repeat(60));
console.log(`
✅ الخادم يعمل على: http://localhost:${process.env.PORT || 3000}
✅ البيئة: ${process.env.NODE_ENV || 'development'}
✅ قاعدة البيانات: متصلة
✅ API متجهز: http://localhost:${process.env.PORT || 3000}/api

📚 الصفحات المتاحة:
  • الرئيسية: http://localhost:${process.env.PORT || 3000}/
  • المنتجات: http://localhost:${process.env.PORT || 3000}/products
  • السلة: http://localhost:${process.env.PORT || 3000}/cart
  • تسجيل الدخول: http://localhost:${process.env.PORT || 3000}/login

🛑 لإيقاف الخادم: اضغط Ctrl + C

` + '='.repeat(60) + '\n');
