#!/bin/bash

echo "🚀 بدء تثبيت المتجر الإلكتروني..."
echo "=================================="

cd /workspaces/e-store-nodejs-app

# حذف الملفات المؤقتة
echo "🧹 تنظيف الملفات المؤقتة..."
rm -rf node_modules package-lock.json 2>/dev/null
npm cache clean --force 2>/dev/null

# التثبيت
echo "📦 تثبيت المكتبات..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ تم التثبيت بنجاح!"
  echo ""
  echo "🚀 لتشغيل المتجر استخدم:"
  echo "   npm run dev"
  echo ""
  echo "🌐 ثم افتح:"
  echo "   http://localhost:3000"
else
  echo "❌ فشل التثبيت"
  exit 1
fi
