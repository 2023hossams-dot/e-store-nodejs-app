#!/bin/bash

# 🔍 تشخيص المشروع

echo "🔍 تشخيص متجر إلكتروني..."
echo "======================================"

echo ""
echo "✓ فحص Node.js:"
node --version

echo ""
echo "✓ فحص npm:"
npm --version

echo ""
echo "✓ فحص الملفات الأساسية:"
test -f ".env" && echo "  ✅ .env موجود" || echo "  ❌ .env غير موجود"
test -f "package.json" && echo "  ✅ package.json موجود" || echo "  ❌ package.json غير موجود"
test -f "src/server.js" && echo "  ✅ src/server.js موجود" || echo "  ❌ src/server.js غير موجود"
test -d "node_modules" && echo "  ✅ node_modules موجود" || echo "  ❌ node_modules غير موجود"

echo ""
echo "✓ فحص Dependencies:"
npm ls --depth=0 2>&1 | head -20

echo ""
echo "✓ فحص المنفذ 3000:"
lsof -i :3000 || echo "  ✅ المنفذ 3000 متاح"

echo ""
echo "✓ محتوى .env:"
head -6 .env

echo ""
echo "======================================"
echo "✅ التشخيص مكتمل!"
