#!/bin/bash

# 🚀 Start Server Script

echo "================================"
echo "🚀 بدء تشغيل المتجر الإلكتروني"
echo "================================"

# Kill any process using port 3000
echo "🧹 تنظيف المنافذ..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 1

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت المكتبات..."
  npm install
fi

# Start the server
echo "✅ بدء الخادم..."
npm start
