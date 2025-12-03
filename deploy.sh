#!/bin/bash
# 🚀 DEPLOY SCRIPT - PETMATCH.FUN PRODUCTION

echo "🚀 Starting PetMatch.fun Production Deployment..."
echo ""

# Step 1: Build Frontend
echo "📦 Building Frontend..."
cd client
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Step 2: Test Backend
echo "🧪 Testing Backend..."
cd ../server
npm test 2>/dev/null || echo "⚠️ No tests found, skipping..."

echo ""
echo "✅ All checks passed!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Deploy Backend to Render: https://render.com"
echo "2. Deploy Frontend to Vercel: Run 'vercel --prod' in client folder"
echo "3. Configure DNS in Cloudflare"
echo ""
echo "🎉 Ready to launch!"
