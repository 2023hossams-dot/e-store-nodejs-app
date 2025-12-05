# 🚀 دليل النشر إلى Firebase Hosting + Cloud Run

هذا الدليل يوضح خطوات نشر تطبيق Node.js الخاص بك على **Firebase Hosting** مع ربطه بـ **Google Cloud Run**.

## المتطلبات الأساسية

- حساب Google Cloud مع مشروع نشط
- `gcloud` CLI مثبت ومُعدّ
- `firebase-tools` مثبت محلياً
- التفويض (authentication) مُعدّ: `gcloud auth login` و `firebase login`

## الخطوة 1: تحديث بيانات المشروع

### تحديث معرّف المشروع

قبل النشر، استبدل `e-store-prod-123` بمعرّف مشروعك الفعلي في الملفات التالية:

```bash
# في .firebaserc
{
  "projects": {
    "default": "YOUR_ACTUAL_PROJECT_ID"
  }
}

# في firebase.json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "e-store-app",
          "region": "YOUR_REGION"  # مثل: us-central1, europe-west1
        }
      }
    ]
  }
}
```

## الخطوة 2: تعيين متغيرات البيئة والأسرار

### 2.1 إنشاء متغيرات البيئة في Cloud Run

```bash
# استبدل القيم بقيمك الفعلية
export PROJECT_ID="YOUR_ACTUAL_PROJECT_ID"
export REGION="us-central1"
export SERVICE_NAME="e-store-app"

# تعيين المشروع الحالي
gcloud config set project $PROJECT_ID
```

### 2.2 إنشاء أسرار في Secret Manager (اختياري - الأكثر أماناً)

```bash
# إنشاء سرّ لـ MongoDB URI
echo -n "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority" | \
  gcloud secrets create MONGODB_URI --data-file=-

# إنشاء سرّ لـ SESSION_SECRET
echo -n "your-session-secret-here-change-this" | \
  gcloud secrets create SESSION_SECRET --data-file=-

# إنشاء سرّ لـ JWT_SECRET
echo -n "your-jwt-secret-here-change-this" | \
  gcloud secrets create JWT_SECRET --data-file=-
```

### 2.3 منح صلاحيات الوصول إلى Secret Manager

```bash
# اجعل حساب الخدمة في Cloud Run يمكنه قراءة الأسرار
gcloud secrets add-iam-policy-binding MONGODB_URI \
  --member=serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding SESSION_SECRET \
  --member=serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding JWT_SECRET \
  --member=serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

## الخطوة 3: بناء وإرسال الصورة إلى Container Registry

### الخيار A: استخدام Cloud Build (موصى به)

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_REGION=$REGION,_PROJECT_ID=$PROJECT_ID
```

### الخيار B: البناء المحلي والإرسال اليدوي

```bash
# بناء الصورة محلياً
docker build -t gcr.io/$PROJECT_ID/e-store-app:latest .

# إرسال الصورة إلى Container Registry
docker push gcr.io/$PROJECT_ID/e-store-app:latest

# نشر الصورة على Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/e-store-app:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "MONGODB_URI=MONGODB_URI:latest,SESSION_SECRET=SESSION_SECRET:latest,JWT_SECRET=JWT_SECRET:latest"
```

## الخطوة 4: ربط Firebase Hosting بـ Cloud Run

### 4.1 تحديث firebase.json (إذا لزم الأمر)

تأكد من أن `firebase.json` يحتوي على:

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "e-store-app",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4.2 نشر Firebase Hosting

```bash
firebase deploy --only hosting
```

## الخطوة 5: التحقق من النشر

### تحقق من حالة Cloud Run

```bash
# عرض تفاصيل الخدمة
gcloud run services describe $SERVICE_NAME --region $REGION

# عرض السجلات
gcloud run services logs read $SERVICE_NAME --region $REGION --limit 100
```

### اختبر التطبيق

```bash
# الوصول إلى موقعك على Firebase Hosting
https://YOUR_PROJECT_ID.web.app/

# اختبر endpoints API
curl https://YOUR_PROJECT_ID.web.app/api/health
curl https://YOUR_PROJECT_ID.web.app/
```

## استكشاف الأخطاء

### المشكلة: "Permission denied" عند نشر Cloud Run

**الحل:**
```bash
# تأكد من تفعيل Artifact Registry API و Cloud Run API
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

### المشكلة: تطبيقك لا يستجيب

**الحل:**
1. تحقق من السجلات:
```bash
gcloud run services logs read $SERVICE_NAME --region $REGION --limit 200
```

2. تأكد من أن المتغيرات البيئية معينة بشكل صحيح:
```bash
gcloud run services describe $SERVICE_NAME --region $REGION
```

### المشكلة: Firebase Hosting لا توجّه الطلبات إلى Cloud Run

**الحل:**
1. تحقق من أن `serviceId` في `firebase.json` يطابق اسم خدمة Cloud Run
2. تأكد من أن المنطقة في `firebase.json` تطابق منطقة Cloud Run

## الأوامر السريعة للنشر

بعد إعداد كل شيء لأول مرة، استخدم هذه الأوامر للنشر السريع:

```bash
# تعيين المتغيرات
export PROJECT_ID="YOUR_PROJECT_ID"
export REGION="us-central1"
export SERVICE_NAME="e-store-app"

# نشر كامل
gcloud config set project $PROJECT_ID && \
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_REGION=$REGION && \
firebase deploy --only hosting
```

## ملاحظات أمان مهمة

⚠️ **لا تضع الأسرار في الكود أو متغيرات البيئة المكشوفة**
- استخدم Google Secret Manager دائماً للأسرار الحساسة
- لا تضع مفاتيح API في ملفات `.env` في الريبو
- قيّد صلاحيات الوصول للخدمات الحساسة

## للمساعدة والدعم

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)

---
**تم الإنشاء في:** 2025-12-05
**الإصدار:** 1.0
