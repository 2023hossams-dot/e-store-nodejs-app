# نشر المشروع إلى Firebase Hosting + Cloud Run (web.app)

هذا المستند يشرح خطوات نشر التطبيق على Google Cloud Run وربطه بـ Firebase Hosting ليظهر على دومين `*.web.app`.

المتطلبات المسبقة:
- امتلاك حساب Google Cloud وFirebase
- تثبيت `gcloud` و `firebase` CLI
- تمكين Cloud Run وArtifact Registry/Container Registry وCloud Build

خطوات سريعة:

1. تسجيل الدخول إلى Google Cloud وتهيئة المشروع:

```bash
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
```

2. تفعيل APIs المطلوبة:

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

3. بناء ونشر عبر Cloud Build (سيفحص `cloudbuild.yaml`):

```bash
gcloud builds submit --config cloudbuild.yaml --substitutions=_REGION=us-central1
```

4. أو يمكنك بناء ورفع صورة يدوياً ثم نشر:

```bash
docker build -t gcr.io/YOUR_GCP_PROJECT_ID/e-store-app:latest .
docker push gcr.io/YOUR_GCP_PROJECT_ID/e-store-app:latest
gcloud run deploy e-store-app --image gcr.io/YOUR_GCP_PROJECT_ID/e-store-app:latest --platform managed --region us-central1 --allow-unauthenticated
```

5. إعداد Firebase Hosting لعمل Rewrite إلى Cloud Run (يفضل استخدام نفس مشروع Firebase):

```bash
firebase login
firebase init hosting
# ثم اختر المشروع (same as GCP project) وضعت config في firebase.json
firebase deploy --only hosting
```

ملاحظات:
- ملف `firebase.json` هنا يقوم بإعادة توجيه جميع طلبات `/api/**` إلى خدمة Cloud Run المسماة `e-store-app`.
- قبل النشر تأكد من وضع متغيرات البيئة الحقيقية عبر Secret Manager أو إعدادات Cloud Run console.
- إذا كنت تفضل Vercel أو Render أو Heroku فملف `Dockerfile` و `Procfile` جاهزان.
