# 🎯 دليل التشغيل الكامل

## الخطوة 1: التأكد من البيئة

```bash
# تحقق من Node.js
node --version  # يجب أن يكون v14 أو أعلى

# تحقق من npm
npm --version   # يجب أن يكون v6 أو أعلى
```

## الخطوة 2: تثبيت المكتبات

```bash
# تثبيت جميع التبعيات
npm install

# أو باستخدام yarn
yarn install
```

## الخطوة 3: التحقق من .env

افتح `.env` وتأكد من:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://hossams777910778_db_user:5aw3IhNH7cldnMf2@cluster0.kfz30vh.mongodb.net/MyProStoreDB?retryWrites=true&w=majority
JWT_SECRET=estore-development-secret-key-change-this
SESSION_SECRET=estore-session-secret-key-change-this
```

## الخطوة 4: بدء الخادم

### الطريقة 1: الأوامر المباشرة

**للتطوير (مع hot-reload):**
```bash
npm run dev
```

**للإنتاج:**
```bash
npm start
```

### الطريقة 2: استخدام Script

```bash
# اجعل الملف قابل للتنفيذ
chmod +x start.sh

# شغله
./start.sh
```

## الخطوة 5: التحقق من الخادم

افتح في المتصفح:
```
http://localhost:3000
```

### ستظهر الرسائل التالية في Terminal:

```
==================================================
🚀 متجرك الإلكتروني
==================================================
✓ Server يعمل على: http://localhost:3000
✓ البيئة: development
✓ قاعدة البيانات: mongodb+srv://...
==================================================
```

---

## 🔍 اختبار الواجهة الأمامية

### الصفحات المتاحة:

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | http://localhost:3000/ |
| المنتجات | http://localhost:3000/products |
| السلة | http://localhost:3000/cart |
| تسجيل الدخول | http://localhost:3000/login |
| التسجيل | http://localhost:3000/register |

---

## 🧪 اختبار الـ API

### استخدام cURL أو Postman

**جلب جميع المنتجات:**
```bash
curl http://localhost:3000/api/products
```

**البحث عن منتج:**
```bash
curl http://localhost:3000/api/products/search?q=laptop
```

**إنشاء مستخدم جديد:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "محمد",
    "lastName": "أحمد",
    "email": "user@example.com",
    "password": "12345678",
    "phone": "0123456789"
  }'
```

---

## ⚠️ استكشاف الأخطاء

### خطأ: "EADDRINUSE: address already in use :::3000"

```bash
# العثور على العملية المستخدمة للمنفذ
lsof -i :3000

# إيقافها
kill -9 <PID>

# أو استخدم start.sh الذي يفعل هذا تلقائياً
bash start.sh
```

### خطأ: "Cannot find module 'express'"

```bash
# أعد تثبيت المكتبات
rm -rf node_modules package-lock.json
npm install
```

### خطأ: "MongoDB connection failed"

```
تأكد من:
1. عنوان MONGODB_URI صحيح في .env
2. الإنترنت متصل
3. IP الخادم مسموح في MongoDB Atlas
4. بيانات المستخدم صحيحة
```

---

## 📊 مراقبة الخادم

### عرض الـ Logs

يتم عرض جميع الطلبات والأخطاء مباشرة في Terminal:

```
✓ GET /api/products 200 - 45ms
✓ POST /api/auth/register 201 - 120ms
✗ GET /api/products/invalid 404 - 5ms
```

### إيقاف الخادم

```bash
# في Terminal
Ctrl + C

# أو
Cmd + C  (على Mac)
```

---

## 🚀 للإنتاج (Deployment)

### تغيير البيئة

غيّر `.env` أو أنشئ `.env.production`:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-production-uri
JWT_SECRET=your-production-secret
SESSION_SECRET=your-production-secret
```

### شغل بـ PM2 (للاستقرار)

```bash
# تثبيت PM2 عالمياً
npm install -g pm2

# شغل التطبيق
pm2 start src/server.js --name "estore"

# عرض الحالة
pm2 status

# عرض الـ Logs
pm2 logs estore
```

---

## 📚 مراجع إضافية

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**✨ تم! المشروع جاهز للتشغيل!**
