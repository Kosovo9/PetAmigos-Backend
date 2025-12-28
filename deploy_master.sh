#!/bin/bash
# 🚀 PETMATCH GLOBAL - MASTER DEPLOYMENT SCRIPT (v2.0)
# Designed for Render, Railway, or VPS with Unified Architecture

echo "🔥 STARTING PETMATCH GLOBAL DEPLOYMENT..."
set -e # Exit on error

# ---------------------------------------------------------
# 1. CLEANUP
# ---------------------------------------------------------
echo "🧹 Cleaning up previous builds..."
rm -rf dist

# ---------------------------------------------------------
# 2. INSTALLATION
# ---------------------------------------------------------
echo "📦 Installing fresh dependencies..."
pnpm install --frozen-lockfile

# ---------------------------------------------------------
# 3. QUALITY ASSURANCE
# ---------------------------------------------------------
echo "🧪 Running AI Matching Reliability Tests..."
pnpm test

# ---------------------------------------------------------
# 4. UNIFIED BUILD
# ---------------------------------------------------------
echo "🏗️ Building Unified Distribution (Frontend + Backend)..."
pnpm build

# ---------------------------------------------------------
# 5. DATABASE SYNC
# ---------------------------------------------------------
if [[ "$SKIP_DB" == "true" ]]; then
  echo "⏩ Skipping Database Sync..."
else
  echo "🗄️ Synchronizing MySQL Spatial Schema..."
  pnpm db:push
fi

# ---------------------------------------------------------
# 6. SEEDING (Optional)
# ---------------------------------------------------------
if [[ "$SEED_DB" == "true" ]]; then
  echo "🐾 Injecting 1000X Global Discovery Data..."
  pnpm db:seed
fi

echo ""
echo "=========================================================="
echo "✅ DEPLOYMENT PREPARATION SUCCESSFUL!"
echo "=========================================================="
echo "🚀 BUILD READY IN: /dist"
echo "🌐 FRONTEND IN: /dist/public"
echo "⚙️ SERVER ENTRY: /dist/index.js"
echo ""
echo "To start the production server locally:"
echo "pnpm start"
echo "=========================================================="
