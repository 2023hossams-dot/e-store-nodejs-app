#!/bin/bash

# اختبار سريع للتحقق من البنية الأساسية للمشروع

echo "🧪 اختبار بنية المشروع - متجر إلكتروني"
echo "========================================"
echo ""

# الألوان
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# عداد الاختبارات
PASSED=0
FAILED=0

# دالة للاختبار
test_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} موجود: $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} مفقود: $1"
    ((FAILED++))
  fi
}

# دالة لاختبار المجلد
test_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} موجود: $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} مفقود: $1"
    ((FAILED++))
  fi
}

echo "📁 اختبار المجلدات:"
test_dir "src"
test_dir "src/models"
test_dir "src/controllers"
test_dir "src/routes"
test_dir "src/middleware"
test_dir "public"
test_dir "public/css"
test_dir "public/js"
test_dir "views"

echo ""
echo "📄 اختبار ملفات الإعدادات:"
test_file ".env.example"
test_file "package.json"
test_file "README.md"

echo ""
echo "📦 اختبار نماذج البيانات:"
test_file "src/models/User.js"
test_file "src/models/Product.js"
test_file "src/models/Order.js"
test_file "src/models/Cart.js"
test_file "src/models/Category.js"
test_file "src/models/Review.js"
test_file "src/models/Coupon.js"

echo ""
echo "🎮 اختبار المتحكمات:"
test_file "src/controllers/authController.js"
test_file "src/controllers/productController.js"
test_file "src/controllers/orderController.js"

echo ""
echo "🛣️  اختبار المسارات:"
test_file "src/routes/authRoutes.js"
test_file "src/routes/productRoutes.js"
test_file "src/routes/orderRoutes.js"
test_file "src/routes/cartRoutes.js"

echo ""
echo "🔒 اختبار الـ Middleware:"
test_file "src/middleware/auth.js"
test_file "src/middleware/errorHandler.js"
test_file "src/middleware/rateLimiter.js"
test_file "src/middleware/security.js"

echo ""
echo "🖥️  اختبار صفحات الويب:"
test_file "views/layout.html"
test_file "views/index.html"
test_file "views/products.html"
test_file "views/cart.html"
test_file "views/login.html"
test_file "views/register.html"

echo ""
echo "🎨 اختبار ملفات العميل:"
test_file "public/css/style.css"
test_file "public/js/main.js"

echo ""
echo "📖 اختبار التوثيق:"
test_file "API_DOCUMENTATION.md"
test_file "DEVELOPMENT_SUMMARY.md"
test_file "GETTING_STARTED.sh"

echo ""
echo "========================================"
echo -e "${GREEN}✓ نجح: $PASSED${NC}"
echo -e "${RED}✗ فشل: $FAILED${NC}"
echo "========================================"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 جميع الاختبارات نجحت!${NC}"
  echo ""
  echo "👉 الخطوات التالية:"
  echo "   1. cd e-store-nodejs-app"
  echo "   2. npm install"
  echo "   3. cp .env.example .env"
  echo "   4. npm run dev"
  echo ""
  exit 0
else
  echo -e "${RED}⚠️  بعض الملفات مفقودة!${NC}"
  exit 1
fi
