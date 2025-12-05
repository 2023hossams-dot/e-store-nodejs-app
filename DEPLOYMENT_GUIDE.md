# 🚀 دليل نشر التطبيق على Web.app

## 📋 الفهرس

1. [النشر على Vercel](#vercel)
2. [النشر على Heroku](#heroku)
3. [النشر على Google Cloud](#google-cloud)
4. [النشر مع Docker](#docker)
5. [الإعدادات والمتغيرات](#الإعدادات)

---

## 🔗 Vercel

### الخطوات:

1. **إنشاء حساب Vercel**
   ```bash
   # زيارة https://vercel.com
   ```

2. **ربط المستودع**
   - انقر على "Import Project"
   - اختر مستودع GitHub الخاص بك

3. **إضافة متغيرات البيئة**
   ```
   MONGODB_URI: <your_mongodb_uri>
   JWT_SECRET: <your_jwt_secret>
   SESSION_SECRET: <your_session_secret>
   ```

4. **النشر التلقائي**
   ```bash
   git push origin main
   # سيتم النشر تلقائياً
   ```

### الرابط:
```
https://your-app-name.vercel.app
```

---

## 🔗 Heroku

### الخطوات:

1. **تثبيت Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows/Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **تسجيل الدخول**
   ```bash
   heroku login
   ```

3. **إنشاء تطبيق**
   ```bash
   heroku create your-app-name
   ```

4. **إضافة متغيرات البيئة**
   ```bash
   heroku config:set MONGODB_URI="<your_mongodb_uri>"
   heroku config:set JWT_SECRET="<your_jwt_secret>"
   heroku config:set SESSION_SECRET="<your_session_secret>"
   heroku config:set NODE_ENV="production"
   ```

5. **النشر**
   ```bash
   git push heroku main
   ```

6. **الوصول للتطبيق**
   ```bash
   heroku open
   heroku logs --tail  # لمراقبة السجلات
   ```

### الرابط:
```
https://your-app-name.herokuapp.com
```

---

## ☁️ Google Cloud

### الخطوات:

1. **تثبيت Google Cloud SDK**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **تسجيل الدخول**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **نشر التطبيق**
   ```bash
   gcloud app deploy
   ```

4. **عرض السجلات**
   ```bash
   gcloud app logs read
   ```

5. **إيقاف التطبيق**
   ```bash
   gcloud app versions list
   gcloud app versions stop VERSION_ID
   ```

### الرابط:
```
https://your-project-id.appspot.com
```

---

## 🐳 Docker

### الخطوات:

1. **بناء الصورة**
   ```bash
   docker build -t estore-app:latest .
   ```

2. **تشغيل المحتوية**
   ```bash
   docker-compose up -d
   ```

3. **وقف التطبيق**
   ```bash
   docker-compose down
   ```

4. **مراقبة السجلات**
   ```bash
   docker-compose logs -f app
   ```

5. **نشر على Docker Hub**
   ```bash
   docker login
   docker tag estore-app:latest username/estore-app:latest
   docker push username/estore-app:latest
   ```

---

## ⚙️ الإعدادات

### متغيرات البيئة المطلوبة

```env
# Server
NODE_ENV=production
PORT=3000
APP_DOMAIN=https://your-app-domain.com

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRE=7d
SESSION_SECRET=your_session_secret_key_at_least_32_chars

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SecurePassword123!
ADMIN_EMAIL=admin@example.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment (Optional)
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_PUBLIC_KEY=pk_live_your_stripe_key

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-app-domain.com
```

### قائمة تحقق ما قبل النشر

- [ ] تعديل متغيرات البيئة
- [ ] اختبار التطبيق محلياً: `npm run dev`
- [ ] مراجعة ملف package.json
- [ ] التأكد من وجود Procfile
- [ ] اختبار الاتصال بـ MongoDB
- [ ] تعطيل وضع التطوير: `NODE_ENV=production`
- [ ] إنشاء نسخة احتياطية من البيانات
- [ ] اختبار عملية الدفع (إن وجدت)

---

## 📊 المراقبة والصيانة

### مراقبة الأداء

```bash
# Heroku
heroku logs -t
heroku ps

# Google Cloud
gcloud app logs read -f
gcloud app describe

# Docker
docker stats
docker logs -f container_name
```

### تحديث التطبيق

```bash
# Vercel (تلقائي عند push)
git commit -m "Update features"
git push origin main

# Heroku
git commit -m "Update features"
git push heroku main

# Google Cloud
gcloud app deploy --version v2
```

### استكشاف الأخطاء

```bash
# Vercel Dashboard
https://vercel.com/dashboard

# Heroku Dashboard
heroku logs --tail --app your-app-name

# Google Cloud Console
https://console.cloud.google.com
```

---

## 🔐 نصائح الأمان

1. **استخدام HTTPS** - جميع المنصات توفرها تلقائياً
2. **متغيرات آمنة** - لا تضع أسرار في الكود
3. **تحديثات منتظمة** - حدّث المكتبات بانتظام
4. **النسخ الاحتياطية** - احفظ قاعدة البيانات
5. **المراقبة** - راقب السجلات والأخطاء

---

## 📚 مراجع مفيدة

- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [Google Cloud Docs](https://cloud.google.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## 🆘 استكشاف الأخطاء الشائعة

### "Cannot find module"
```bash
npm install
npm ci
```

### "Connection refused"
```bash
# تحقق من متغيرات البيئة
echo $MONGODB_URI
```

### "Port already in use"
```bash
# لينكس/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "MongoDB connection timeout"
```bash
# تحقق من IP whitelist
# تأكد من صحة connection string
# تحقق من الشهادات إن لزم
```

---

**حالة النشر:** ✅ جاهز للإنتاج
**آخر تحديث:** 2025
