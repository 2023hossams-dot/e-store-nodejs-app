#!/bin/bash

# متجرك الإلكتروني - دليل الاستخدام السريع

echo "======================================"
echo "🛍️  متجرك الإلكتروني"
echo "======================================"
echo ""
echo "✅ المتطلبات:"
echo "   • Node.js (v14+)"
echo "   • MongoDB"
echo "   • npm أو yarn"
echo ""
echo "📥 خطوات التثبيت:"
echo ""
echo "1️⃣  التثبيت الأساسي:"
echo "    npm install"
echo ""
echo "2️⃣  إعداد البيئة:"
echo "    cp .env.example .env"
echo "    # ثم عدّل قيم .env حسب احتياجاتك"
echo ""
echo "3️⃣  تشغيل السيرفر:"
echo "    # للتطوير:"
echo "    npm run dev"
echo ""
echo "    # للإنتاج:"
echo "    npm start"
echo ""
echo "🌐 الوصول إلى التطبيق:"
echo "    http://localhost:3000"
echo ""
echo "📚 بعض الروابط المهمة:"
echo "    • الصفحة الرئيسية:  http://localhost:3000/"
echo "    • المنتجات:        http://localhost:3000/products"
echo "    • تسجيل الدخول:    http://localhost:3000/login"
echo "    • التسجيل:         http://localhost:3000/register"
echo "    • السلة:           http://localhost:3000/cart"
echo ""
echo "🔌 API Endpoints الأساسية:"
echo ""
echo "🔐 المصادقة:"
echo "    POST   /api/auth/register"
echo "    POST   /api/auth/login"
echo "    GET    /api/auth/me"
echo "    PUT    /api/auth/profile"
echo "    PUT    /api/auth/change-password"
echo ""
echo "📦 المنتجات:"
echo "    GET    /api/products"
echo "    GET    /api/products/:id"
echo "    GET    /api/products/featured"
echo "    GET    /api/products/search?q=keyword"
echo ""
echo "🛒 السلة:"
echo "    GET    /api/cart"
echo "    POST   /api/cart/add"
echo "    POST   /api/cart/remove/:productId"
echo "    PUT    /api/cart/update/:productId"
echo ""
echo "📋 الطلبات:"
echo "    POST   /api/orders"
echo "    GET    /api/orders/my-orders"
echo "    GET    /api/orders/:id"
echo ""
echo "======================================"
echo "📖 للمزيد من المعلومات، اقرأ README.md"
echo "======================================"
