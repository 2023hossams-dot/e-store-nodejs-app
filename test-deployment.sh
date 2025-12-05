#!/bin/bash

# ==================== E-STORE DEPLOYMENT TEST ====================

echo "🧪 اختبار استعداد التطبيق للنشر"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to test
test_item() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $2"
    ((FAILED++))
  fi
}

# ==================== CHECKS ====================

echo "📋 الملفات الأساسية:"
[ -f "package.json" ] && test_item 0 "package.json موجود" || test_item 1 "package.json غير موجود"
[ -f "src/server.js" ] && test_item 0 "src/server.js موجود" || test_item 1 "src/server.js غير موجود"
[ -f ".env" ] && test_item 0 ".env موجود" || test_item 1 ".env غير موجود"
[ -f "Procfile" ] && test_item 0 "Procfile موجود" || test_item 1 "Procfile غير موجود"
[ -f "Dockerfile" ] && test_item 0 "Dockerfile موجود" || test_item 1 "Dockerfile غير موجود"

echo ""
echo "📦 المكتبات:"
[ -d "node_modules" ] && test_item 0 "node_modules موجود" || test_item 1 "تشغيل npm install"

echo ""
echo "🌍 ملفات الصفحات:"
[ -f "views/index.html" ] && test_item 0 "الصفحة الرئيسية موجودة" || test_item 1 "الصفحة الرئيسية غير موجودة"
[ -f "views/login.html" ] && test_item 0 "صفحة التسجيل موجودة" || test_item 1 "صفحة التسجيل غير موجودة"
[ -f "views/products.html" ] && test_item 0 "صفحة المنتجات موجودة" || test_item 1 "صفحة المنتجات غير موجودة"
[ -f "views/about.html" ] && test_item 0 "صفحة عن الشركة موجودة" || test_item 1 "صفحة عن الشركة غير موجودة"

echo ""
echo "📄 ملفات التوثيق:"
[ -f "DEPLOYMENT_GUIDE.md" ] && test_item 0 "دليل النشر موجود" || test_item 1 "دليل النشر غير موجود"
[ -f "README.md" ] && test_item 0 "ملف README موجود" || test_item 1 "ملف README غير موجود"

echo ""
echo "🔐 متغيرات البيئة:"
grep -q "MONGODB_URI" .env && test_item 0 "MONGODB_URI موجود" || test_item 1 "MONGODB_URI غير موجود"
grep -q "JWT_SECRET" .env && test_item 0 "JWT_SECRET موجود" || test_item 1 "JWT_SECRET غير موجود"
grep -q "SESSION_SECRET" .env && test_item 0 "SESSION_SECRET موجود" || test_item 1 "SESSION_SECRET غير موجود"

echo ""
echo "🗂️ هيكل المجلدات:"
[ -d "src" ] && test_item 0 "مجلد src موجود" || test_item 1 "مجلد src غير موجود"
[ -d "views" ] && test_item 0 "مجلد views موجود" || test_item 1 "مجلد views غير موجود"
[ -d "public" ] && test_item 0 "مجلد public موجود" || test_item 1 "مجلد public غير موجود"
[ -d "src/routes" ] && test_item 0 "مجلد routes موجود" || test_item 1 "مجلد routes غير موجود"
[ -d "src/models" ] && test_item 0 "مجلد models موجود" || test_item 1 "مجلد models غير موجود"

echo ""
echo "✨ ملفات إضافية:"
[ -f "docker-compose.yml" ] && test_item 0 "docker-compose.yml موجود" || test_item 1 "docker-compose.yml غير موجود"
[ -f "vercel.json" ] && test_item 0 "vercel.json موجود" || test_item 1 "vercel.json غير موجود"
[ -f ".gitignore" ] && test_item 0 ".gitignore موجود" || test_item 1 ".gitignore غير موجود"

echo ""
echo "================================"
echo "📊 النتائج:"
echo -e "✅ نجح: ${GREEN}$PASSED${NC}"
echo -e "❌ فشل: ${RED}$FAILED${NC}"
echo "================================"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ التطبيق جاهز للنشر!${NC}"
  exit 0
else
  echo -e "${RED}✗ توجد مشاكل يجب حلها قبل النشر${NC}"
  exit 1
fi
