# 📂 دليل الملفات - متجر إلكتروني

## 🏗️ هيكل المشروع الشامل

```
e-store-nodejs-app/
│
├── 📄 ملفات الجذر
│   ├── .env.example              📋 متغيرات البيئة (مثال)
│   ├── .env                      🔐 متغيرات البيئة (محلي)
│   ├── package.json              📦 المكتبات والإعدادات
│   ├── README.md                 📖 دليل شامل
│   ├── PROJECT_SUMMARY.md        📊 ملخص المشروع
│   ├── DEVELOPMENT_SUMMARY.md    ✅ ملخص التطوير
│   ├── API_DOCUMENTATION.md      🔌 توثيق API
│   ├── CHECKLIST.md              ✓ قائمة الإنجازات
│   ├── GETTING_STARTED.sh        🚀 دليل سريع
│   └── test-structure.sh         🧪 اختبار البنية
│
├── 📁 src/                       🔧 الكود الخلفي
│   │
│   ├── server.js                 🖥️  السيرفر الرئيسي
│   │
│   ├── 📁 config/               ⚙️  الإعدادات
│   │   └── database.js           🗄️  إعدادات قاعدة البيانات
│   │
│   ├── 📁 models/               🗂️  نماذج البيانات (7 models)
│   │   ├── User.js              👤 نموذج المستخدم
│   │   ├── Product.js           📦 نموذج المنتج
│   │   ├── Order.js             📋 نموذج الطلب
│   │   ├── Cart.js              🛒 نموذج السلة
│   │   ├── Category.js          📂 نموذج الفئة
│   │   ├── Review.js            ⭐ نموذج التقييم
│   │   └── Coupon.js            🎟️  نموذج الكوبون
│   │
│   ├── 📁 controllers/          🎮 المتحكمات (3 controllers)
│   │   ├── authController.js    🔐 متحكم المصادقة
│   │   │   ├── register()
│   │   │   ├── login()
│   │   │   ├── getCurrentUser()
│   │   │   ├── updateProfile()
│   │   │   ├── changePassword()
│   │   │   └── logout()
│   │   │
│   │   ├── productController.js 📦 متحكم المنتجات
│   │   │   ├── getAllProducts()
│   │   │   ├── getProductById()
│   │   │   ├── getProductBySlug()
│   │   │   ├── createProduct()
│   │   │   ├── updateProduct()
│   │   │   ├── deleteProduct()
│   │   │   ├── getFeaturedProducts()
│   │   │   ├── getProductsByCategory()
│   │   │   └── searchProducts()
│   │   │
│   │   └── orderController.js   📋 متحكم الطلبات
│   │       ├── createOrder()
│   │       ├── getUserOrders()
│   │       ├── getOrderById()
│   │       ├── cancelOrder()
│   │       ├── getAllOrders()
│   │       └── updateOrderStatus()
│   │
│   ├── 📁 routes/               🛣️  المسارات (4 route files)
│   │   ├── authRoutes.js        🔐 مسارات المصادقة (6 endpoints)
│   │   ├── productRoutes.js     📦 مسارات المنتجات (9 endpoints)
│   │   ├── orderRoutes.js       📋 مسارات الطلبات (6 endpoints)
│   │   └── cartRoutes.js        🛒 مسارات السلة (5 endpoints)
│   │
│   └── 📁 middleware/           🔒 الوسائط (4 middleware files)
│       ├── auth.js              🔐 مصادقة وتفويض
│       │   ├── protect()
│       │   ├── authorize()
│       │   ├── isAdmin()
│       │   ├── isAuth()
│       │   └── optionalAuth()
│       │
│       ├── errorHandler.js      ⚠️  معالجة الأخطاء
│       │   ├── handleValidationErrors()
│       │   ├── errorHandler()
│       │   ├── notFound()
│       │   └── asyncHandler()
│       │
│       ├── rateLimiter.js       ⏱️  تحديد معدل الطلبات
│       │   ├── generalLimiter
│       │   ├── authLimiter
│       │   ├── createOrderLimiter
│       │   └── searchLimiter
│       │
│       └── security.js          🛡️  الأمان
│           ├── sanitizeInput()
│           ├── corsHeaders()
│           ├── securityHeaders()
│           └── requestLogger()
│
├── 📁 public/                   🎨 الملفات الثابتة
│   │
│   ├── 📁 css/                  🎨 أنماط CSS
│   │   └── style.css            🎨 الأنماط الشاملة (1000+ lines)
│   │       ├── Variables & Colors
│   │       ├── Typography
│   │       ├── Layout & Grid
│   │       ├── Components
│   │       ├── Forms
│   │       ├── Buttons
│   │       ├── Cards
│   │       ├── Alerts
│   │       ├── Product Cards
│   │       ├── Pagination
│   │       ├── Footer
│   │       ├── Utilities
│   │       └── Responsive
│   │
│   ├── 📁 js/                   💻 ملفات JavaScript
│   │   └── main.js              💻 الكود الرئيسي (400+ lines)
│   │       ├── API Configuration
│   │       ├── Token Management
│   │       ├── API Request Helper
│   │       ├── Auth Functions
│   │       ├── Product Functions
│   │       ├── Cart Functions
│   │       ├── Order Functions
│   │       ├── UI Helpers
│   │       └── Event Listeners
│   │
│   └── 📁 images/               🖼️  الصور (جاهز للإضافة)
│
├── 📁 views/                    🖥️  صفحات HTML (9 pages)
│   ├── layout.html              🏗️  القالب الأساسي
│   │   ├── Header & Navigation
│   │   ├── Main Content
│   │   └── Footer
│   │
│   ├── index.html               🏠 الصفحة الرئيسية
│   │   ├── Hero Section
│   │   ├── Featured Products
│   │   ├── Categories
│   │   └── Why Choose Us
│   │
│   ├── products.html            📦 قائمة المنتجات
│   │   ├── Sidebar Filters
│   │   ├── Product Grid
│   │   ├── Pagination
│   │   └── Search
│   │
│   ├── product-details.html     🔍 تفاصيل المنتج (جاهز)
│   │   ├── Product Images
│   │   ├── Product Info
│   │   ├── Reviews
│   │   └── Add to Cart
│   │
│   ├── cart.html                🛒 سلة التسوق
│   │   ├── Cart Items Table
│   │   ├── Cart Summary
│   │   └── Checkout Button
│   │
│   ├── checkout.html            💳 صفحة الدفع (جاهز)
│   │   ├── Shipping Address
│   │   ├── Billing Address
│   │   ├── Payment Method
│   │   └── Order Summary
│   │
│   ├── login.html               🔐 تسجيل الدخول
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Login Button
│   │   └── Register Link
│   │
│   ├── register.html            📝 صفحة التسجيل
│   │   ├── Name Fields
│   │   ├── Email Input
│   │   ├── Phone Input
│   │   ├── Password Fields
│   │   └── Terms Checkbox
│   │
│   ├── account.html             👤 الملف الشخصي (جاهز)
│   │   ├── Personal Info
│   │   ├── Addresses
│   │   ├── Preferences
│   │   └── Security
│   │
│   └── orders.html              📋 الطلبات (جاهز)
│       ├── Orders List
│       ├── Order Details
│       └── Order Status
│
└── 📖 ملفات التوثيق (6 files)
    ├── README.md                📖 دليل شامل (200+ lines)
    ├── API_DOCUMENTATION.md     🔌 توثيق API (500+ lines)
    ├── DEVELOPMENT_SUMMARY.md   ✅ ملخص التطوير (400+ lines)
    ├── PROJECT_SUMMARY.md       📊 ملخص المشروع (200+ lines)
    ├── CHECKLIST.md             ✓ قائمة الإنجازات (200+ lines)
    └── GETTING_STARTED.sh       🚀 دليل سريع
```

---

## 📊 إحصائيات الملفات

### Backend Files
| المجلد | عدد الملفات | الوصف |
|--------|-----------|-------|
| models | 7 | نماذج قاعدة البيانات |
| controllers | 3 | معالجات الطلبات |
| routes | 4 | مسارات API |
| middleware | 4 | وسائط التطبيق |
| **المجموع** | **18** | **ملفات Backend** |

### Frontend Files
| المجلد | عدد الملفات | الوصف |
|--------|-----------|-------|
| views | 9 | صفحات HTML |
| public/css | 1 | ملفات CSS |
| public/js | 1 | ملفات JavaScript |
| **المجموع** | **11** | **ملفات Frontend** |

### Configuration & Documentation
| المجلد | عدد الملفات | الوصف |
|--------|-----------|-------|
| root | 3 | .env, package.json |
| documentation | 6 | README وملفات التوثيق |
| scripts | 2 | أدوات الاختبار |
| **المجموع** | **11** | **ملفات الإعدادات** |

---

## 🔗 العلاقات بين الملفات

```
server.js (الرئيسي)
├── models/* (النماذج)
├── controllers/* (المتحكمات)
├── routes/* (المسارات)
├── middleware/* (الوسائط)
├── views/* (الصفحات)
└── public/* (الملفات الثابتة)

controllers/
├── authController.js ← models/User.js
├── productController.js ← models/Product.js
└── orderController.js ← models/Order.js, models/Product.js

routes/
├── authRoutes.js → controllers/authController.js
├── productRoutes.js → controllers/productController.js
├── orderRoutes.js → controllers/orderController.js
└── cartRoutes.js → models/Cart.js

middleware/
├── auth.js (مستخدم في جميع routes المحمية)
├── errorHandler.js (مستخدم في server.js)
├── rateLimiter.js (مستخدم في routes)
└── security.js (مستخدم في server.js)

views/
└── layout.html (يتضمن css و js)
    ├── public/css/style.css
    └── public/js/main.js
```

---

## 📝 أنواع الملفات

| النوع | العدد | الأمثلة |
|------|-------|--------|
| .js (JavaScript) | 20 | controllers, models, routes |
| .html | 9 | views pages |
| .css | 1 | styling |
| .md (Documentation) | 6 | README, API docs |
| .env | 2 | configuration |
| .sh (Scripts) | 2 | testing, setup |
| .json | 1 | package.json |
| **المجموع** | **41** | **ملف** |

---

## 🚀 كيفية التنقل بين الملفات

### لإضافة ميزة جديدة:
1. أنشئ **Model** في `/src/models/`
2. أنشئ **Controller** في `/src/controllers/`
3. أنشئ **Route** في `/src/routes/`
4. استيراد **Route** في `server.js`

### لتعديل API:
1. عدّل **Controller** المناسب
2. اختبر باستخدام **API_DOCUMENTATION.md**

### لتحسين الواجهة:
1. عدّل **HTML** في `/views/`
2. أضف **CSS** في `/public/css/style.css`
3. أضف **JavaScript** في `/public/js/main.js`

---

## 📚 الملفات المهمة

### للبدء
- `README.md` - ابدأ هنا
- `GETTING_STARTED.sh` - خطوات التثبيت
- `.env.example` - المتغيرات المطلوبة

### للتطوير
- `src/server.js` - الملف الرئيسي
- `package.json` - المكتبات
- `API_DOCUMENTATION.md` - توثيق API

### للاختبار
- `test-structure.sh` - التحقق من البنية
- `API_DOCUMENTATION.md` - اختبار API

### للإنتاج
- `.env` - المتغيرات الحقيقية
- `package.json` - المكتبات المطلوبة

---

## 🎯 مسارات الملفات المتكررة

### قراءة البيانات
```
views/ → main.js → /api/products → productController.js → Product model
```

### إنشاء حساب
```
views/register.html → main.js → /api/auth/register → authController.js → User model
```

### شراء منتج
```
views/cart.html → main.js → /api/cart → cartRoutes.js → Cart model
views/checkout.html → main.js → /api/orders → orderController.js → Order model
```

---

**تم تنظيم جميع الملفات بشكل احترافي وواضح لسهولة الصيانة والتطوير.**

---

*آخر تحديث: ديسمبر 2024*
