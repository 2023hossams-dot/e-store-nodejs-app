# 🚀 دليل التشغيل والتثبيت

## متجرك الإلكتروني - نسخة كاملة مع 9 صفحات حديثة

---

## 📋 المتطلبات الأساسية

```bash
Node.js: v14 أو أحدث
npm: v6 أو أحدث
MongoDB: v4.4 أو أحدث (اختياري - الاتصال المحلي)
```

---

## 📦 الملفات المثبتة

### 21 صفحة View جاهزة للاستخدام:

**الصفحات الأساسية**:
```
✅ index.html              - الصفحة الرئيسية
✅ products.html           - عرض المنتجات
✅ product-details.html    - تفاصيل المنتج
✅ cart.html               - السلة
✅ checkout.html           - الدفع
✅ order-confirmation.html - تأكيد الطلب
✅ account.html            - حساب المستخدم
```

**الصفحات الإدارية**:
```
✅ admin-login.html        - تسجيل دخول المشرف
✅ admin-dashboard.html    - لوحة تحكم المشرف
```

**الصفحات الجديدة الحديثة**:
```
✅ search-results.html     - البحث والتصفية
✅ categories.html         - التصنيفات
✅ wishlist.html           - المفضلة
✅ about.html              - عننا
✅ contact.html            - اتصل بنا
✅ faq.html                - الأسئلة الشائعة
✅ terms.html              - الشروط والأحكام
✅ privacy.html            - سياسة الخصوصية
✅ 404.html                - صفحة الخطأ
```

**الصفحات الأخرى**:
```
✅ login.html              - تسجيل دخول
✅ register.html           - التسجيل
✅ layout.html             - التخطيط الأساسي
```

---

## 🔧 التثبيت

### 1. استنساخ المشروع

```bash
cd /workspaces/e-store-nodejs-app
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد ملف الإعدادات

```bash
# إنشاء ملف .env
touch .env
```

**محتوى `.env`**:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/estore

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Admin Default
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123456
```

---

## ▶️ التشغيل

### خيار 1: التشغيل العادي

```bash
npm start
```

### خيار 2: مع nodemon (للتطوير)

```bash
npm install --save-dev nodemon
npm run dev
```

**في `package.json`**:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### خيار 3: الشيل البسيط

```bash
chmod +x run.sh
./run.sh
```

---

## 📱 الوصول للموقع

```
الرابط المحلي: http://localhost:3000
الصفحة الرئيسية: http://localhost:3000/
منطقة المشرف: http://localhost:3000/admin
```

---

## 🔐 بيانات الدخول الافتراضية

### حساب المشرف

```
اسم المستخدم: admin
كلمة المرور: Admin@123456
```

---

## 🗺️ خريطة الطرق (Routes)

### صفحات عامة

```javascript
GET  /                   // الرئيسية
GET  /products           // المنتجات
GET  /products/:id       // تفاصيل المنتج
GET  /search             // البحث والتصفية
GET  /categories         // التصنيفات
GET  /about              // عننا
GET  /contact            // اتصل بنا
GET  /faq                // الأسئلة الشائعة
GET  /terms              // الشروط والأحكام
GET  /privacy            // سياسة الخصوصية
```

### صفحات المستخدم

```javascript
GET  /login              // تسجيل دخول
POST /login              // معالجة الدخول
GET  /register           // التسجيل
POST /register           // معالجة التسجيل
GET  /cart               // السلة
POST /cart/add           // إضافة للسلة
GET  /checkout           // الدفع
POST /checkout/order     // تأكيد الطلب
GET  /account            // حسابي
GET  /wishlist           // المفضلة
```

### صفحات المشرف

```javascript
GET  /admin              // تسجيل دخول المشرف
POST /admin/login        // معالجة الدخول
GET  /admin/dashboard    // لوحة التحكم
```

---

## 📊 هيكل المشروع

```
e-store-nodejs-app/
├── src/
│   ├── server.js           // ملف البداية
│   ├── config/
│   │   ├── database.js     // اتصال MongoDB
│   │   └── adminInit.js    // تهيئة المشرف
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Admin.js
│   │   └── ...
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── productController.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── productRoutes.js
│   │   └── ...
│   └── middleware/
│       ├── auth.js
│       ├── errorHandler.js
│       ├── security.js
│       └── rateLimiter.js
├── views/
│   ├── index.html
│   ├── products.html
│   ├── search-results.html    // جديد
│   ├── categories.html         // جديد
│   ├── wishlist.html           // جديد
│   ├── about.html              // جديد
│   ├── contact.html            // جديد
│   ├── faq.html                // جديد
│   ├── terms.html              // جديد
│   ├── privacy.html            // جديد
│   ├── 404.html                // جديد
│   ├── admin-dashboard.html
│   ├── admin-login.html
│   └── ...
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── package.json
├── .env
└── README.md
```

---

## 🔌 الاتصال بقاعدة البيانات

### الاتصال المحلي

```javascript
// في .env
MONGODB_URI=mongodb://localhost:27017/estore
```

### الاتصال السحابي (MongoDB Atlas)

```javascript
// في .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/estore
```

---

## 🎯 أمثلة على الطلبات

### 1. تسجيل حساب جديد

```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

### 2. تسجيل الدخول

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "Password123"
}
```

### 3. إضافة للسلة

```bash
POST /api/cart/add
Content-Type: application/json
Authorization: Bearer {token}

{
  "productId": "product_id",
  "quantity": 2
}
```

### 4. تقديم طلب

```bash
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "شارع النيل",
    "city": "القاهرة",
    "country": "مصر"
  }
}
```

---

## 🧪 الاختبار

### اختبار في Postman/Insomnia

1. استيراد الـ API Collection
2. تعيين المتغيرات:
   - `baseUrl`: http://localhost:3000
   - `token`: من استجابة التسجيل
3. تشغيل الاختبارات

---

## 🛡️ الأمان

### نقاط الأمان المطبقة

✅ تشفير كلمات المرور مع bcrypt  
✅ JWT Authentication  
✅ CORS Protection  
✅ Rate Limiting  
✅ Input Validation  
✅ SQL Injection Prevention  
✅ XSS Protection  

### تفعيل الأمان

```javascript
// في src/server.js
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
}));
```

---

## 📈 تحسين الأداء

### الخوادم الثابتة

```bash
# تثبيت وضغط الملفات
npm install -g gzip-cli
gzip public/css/style.css
gzip public/js/main.js
```

### Caching

```javascript
// في server.js
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module 'dotenv'"

```bash
npm install dotenv
```

### خطأ: "MongoDB Connection Failed"

```bash
# تأكد من تشغيل MongoDB
mongod

# أو استخدم MongoDB Atlas
```

### خطأ: "Port 3000 already in use"

```bash
# استخدم منفذ مختلف
PORT=3001 npm start

# أو قتل العملية
lsof -ti:3000 | xargs kill -9
```

---

## 📚 الموارد الإضافية

### الدراسة والتعلم

- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

### الأدوات المفيدة

- **Postman**: لاختبار API
- **MongoDB Compass**: لإدارة قاعدة البيانات
- **VS Code**: محرر الأكواد
- **Insomnia**: بديل لـ Postman

---

## 🚢 النشر (Deployment)

### نشر على Heroku

```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء تطبيق
heroku create your-app-name

# ضبط المتغيرات
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret

# نشر التطبيق
git push heroku main
```

### نشر على عميل VPS

```bash
# نسخ الملفات
scp -r . user@server:/path/to/app

# التثبيت والتشغيل
ssh user@server
cd /path/to/app
npm install
npm start
```

---

## 📞 الدعم الفني

### طلب المساعدة

```bash
# في حالة الأخطاء، تحقق من:
1. الأكوام (logs)
2. متطلبات النظام
3. ملف .env
4. الوصلات (Routes)
```

---

## ✅ قائمة التحقق قبل الإطلاق

- ✅ جميع المكتبات مثبتة
- ✅ قاعدة البيانات متصلة
- ✅ الحسابات الافتراضية تعمل
- ✅ الصفحات تحميل بشكل صحيح
- ✅ النماذج تعمل
- ✅ الملاحة بين الصفحات سلسة
- ✅ المشرف يمكنه الوصول
- ✅ الأمان مفعل
- ✅ الأداء جيدة

---

## 🎉 الإطلاق!

```bash
# التشغيل النهائي
npm start

# إذا شاهدت:
# ✅ Server running on port 3000
# ✅ Database connected successfully

# انتقل إلى: http://localhost:3000
```

---

## 📞 التواصل للدعم

في حالة:
- أسئلة تقنية
- طلب تحسينات
- تقارير أخطاء
- مساعدة في التشغيل

**تواصل معي مباشرة!**

---

**آخر تحديث**: يناير 2024  
**الإصدار**: 2.0  
**الحالة**: ✅ جاهز للإنتاج  

🚀 **الآن أنت جاهز لتشغيل متجرك الإلكتروني الكامل!**
