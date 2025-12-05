#!/bin/bash

echo "🛑 إيقاف الخوادم السابقة..."
pkill -f "node src/server.js" 2>/dev/null
pkill -f "nodemon src/server.js" 2>/dev/null
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null
sleep 2

echo "✅ تم إيقاف الخوادم"
echo ""
echo "🚀 تشغيل المتجر على المنفذ 3000..."
echo ""

cd /workspaces/e-store-nodejs-app
npm run dev
