#!/bin/bash

# 📤 سكريبت حفظ سريع في GitHub

cd /workspaces/e-store-nodejs-app

# تكوين Git
git config --global user.email "bot@github.com"
git config --global user.name "GitHub Copilot Bot"

# إضافة الملفات
git add -A

# حفظ التغييرات
git commit -m "🎉 إضافة الميزات الجديدة: التقييمات والإشعارات والمفضلة والبحث المتقدم"

# عرض الحالة
echo ""
echo "✅ تم حفظ التغييرات محليًا!"
echo ""
echo "الآن استخدم:"
echo "  git push origin main"
echo ""
