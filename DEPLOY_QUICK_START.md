# 🚀 دليل النشر السريع - خطوة بخطوة

## المتطلبات المسبقة

تأكد من أن لديك:
- ✅ حساب Google Cloud مع مشروع نشط
- ✅ `gcloud` CLI مثبت ([تحميل هنا](https://cloud.google.com/sdk/docs/install))
- ✅ `firebase-tools` مثبت (`npm install -g firebase-tools`)
- ✅ Docker مثبت

## الخطوة 0: تحضير بيئتك المحلية

```bash
# 1. اذهب إلى مجلد المشروع
cd /path/to/e-store-nodejs-app

# 2. تحقق من وجود الملفات المطلوبة
ls -la Dockerfile .firebaserc cloudbuild.yaml deploy.sh setup-secrets.sh

# 3. إذا لم تكن مثبتة بعد
npm install -g firebase-tools

# 4. تسجيل الدخول إلى Google Cloud
gcloud auth login

# 5. تسجيل الدخول إلى Firebase
firebase login
```

## الخطوة 1: تحديد معرّف مشروعك

اختر **واحداً** من الخيارات التالية:

### الخيار أ: استخدام مشروع Google Cloud موجود

```bash
# 1. اعرض قائمة مشاريعك الحالية
gcloud projects list

# 2. انسخ معرّف المشروع (PROJECT_ID) من القائمة
# مثال: my-store-project-2025

# 3. عدّل .firebaserc
nano .firebaserc
# استبدل "e-store-prod-123" بمعرّفك الفعلي

# 4. حفظ واغلق (Ctrl+X ثم Y)
```

### الخيار ب: إنشاء مشروع جديد

```bash
# 1. أنشئ مشروع جديد
gcloud projects create my-estore-2025 --name "E-Store App"

# 2. عدّل .firebaserc
# استبدل "e-store-prod-123" بـ "my-estore-2025"

# 3. ربط المشروع بـ Firebase
firebase projects:addfirebase my-estore-2025
```

## الخطوة 2: تحديث .firebaserc

```bash
# افتح .firebaserc
cat .firebaserc
```

يجب أن يبدو كالتالي (مع معرّفك الفعلي):
```json
{
  "projects": {
    "default": "YOUR_ACTUAL_PROJECT_ID"
  }
}
```

**مثال:**
```json
{
  "projects": {
    "default": "my-estore-2025"
  }
}
```

## الخطوة 3: إعداد الأسرار (اختياري لكن موصى به)

```bash
# تشغيل script إعداد الأسرار
./setup-secrets.sh

# ستُطلب منك إدخال:
# - MongoDB URI (من MongoDB Atlas)
# - SESSION_SECRET (اترك فارغاً لإنشاء تلقائي)
# - JWT_SECRET (اترك فارغاً لإنشاء تلقائي)
```

## الخطوة 4: تشغيل النشر

### الطريقة 1: الطريقة السهلة (موصى به)

```bash
# شغّل script النشر الكامل
./deploy.sh

# ستُطلب منك تأكيد المتابعة
# اضغط 'yes' وأكمل
```

### الطريقة 2: النشر اليدوي خطوة بخطوة

```bash
# 1. تعيين متغيرات البيئة
export PROJECT_ID="YOUR_PROJECT_ID"
export REGION="us-central1"
export SERVICE_NAME="e-store-app"

# 2. تعيين المشروع الحالي
gcloud config set project $PROJECT_ID

# 3. بناء صورة Docker
docker build -t gcr.io/$PROJECT_ID/e-store-app:latest .

# 4. إعداد Docker للمصادقة مع Google Cloud
gcloud auth configure-docker gcr.io

# 5. دفع الصورة إلى Container Registry
docker push gcr.io/$PROJECT_ID/e-store-app:latest

# 6. نشر على Cloud Run
gcloud run deploy e-store-app \
  --image gcr.io/$PROJECT_ID/e-store-app:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --cpu 1

# 7. نشر على Firebase Hosting
firebase deploy --only hosting --project=$PROJECT_ID
```

## الخطوة 5: التحقق من النشر

```bash
# 1. احصل على رابط Cloud Run
gcloud run services describe e-store-app --region us-central1 --format='value(status.url)'

# 2. اختبر نقطة نهاية API
curl https://YOUR_PROJECT_ID.web.app/api/health

# 3. افتح الموقع في المتصفح
# https://YOUR_PROJECT_ID.web.app
```

## استكشاف الأخطاء

### المشكلة: "gcloud: command not found"

**الحل:** ثبّت Google Cloud SDK
- [دليل التثبيت](https://cloud.google.com/sdk/docs/install)

### المشكلة: "Firebase project not found"

**الحل:**
```bash
# تأكد من تسجيل الدخول
firebase login

# تأكد من صحة PROJECT_ID في .firebaserc
cat .firebaserc

# جرّب إنشاء مشروع Firebase
firebase projects:addfirebase YOUR_PROJECT_ID
```

### المشكلة: "Permission denied" عند الدفع إلى GCR

**الحل:**
```bash
# تأكد من تفويض Docker
gcloud auth configure-docker gcr.io

# أعد المصادقة
gcloud auth login
```

### المشكلة: التطبيق لا يستجيب بعد النشر

**الحل:**
```bash
# عرض السجلات
gcloud run services logs read e-store-app --region us-central1 --limit 100

# تحقق من متغيرات البيئة
gcloud run services describe e-store-app --region us-central1
```

## نصائح مهمة ⚠️

1. **الأسرار:** لا تضع `MONGODB_URI` أو `SESSION_SECRET` في الكود
   - استخدم Secret Manager أو متغيرات البيئة فقط

2. **التكاليف:** Cloud Run بدون استخدام مجاني، لكن لديك حد مجاني شهري

3. **المنطقة:** استخدم المنطقة الأقرب لمستخدميك

4. **الارتفاع تدريجياً:** ابدأ بـ 512Mi RAM و 1 CPU

## الخطوات التالية

بعد نشر ناجح:

- [ ] اختبر جميع الصفحات الرئيسية
- [ ] اختبر عمليات المصادقة والسجلات
- [ ] قم بتكوين النطاق المخصص (اختياري)
- [ ] فعّل HTTPS وشهادة SSL (تلقائي مع Firebase)
- [ ] قم بإعداد مراقبة الأداء والأخطاء

---

**هل تحتاج مساعدة؟**
- اسأل عن خطوة محددة
- شارك رسالة خطأ محددة
- اطلب توضيح لأي جزء

**معلومات مفيدة:**
- [وثائق Firebase Hosting](https://firebase.google.com/docs/hosting)
- [وثائق Cloud Run](https://cloud.google.com/run/docs)
- [دليل Docker](https://docs.docker.com)
