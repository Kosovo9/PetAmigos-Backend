# 🚀 PETMATCH GLOBAL - WINDOWS DEPLOYMENT POWER-SCRIPT (v2.0)
# Use this for local validation or Windows-based server deployment

$ErrorActionPreference = "Stop"

Write-Host "🔥 STARTING PETMATCH GLOBAL WINDOWS DEPLOYMENT..." -ForegroundColor Cyan

# 1. CLEANUP
Write-Host "🧹 Cleaning up previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

# 2. INSTALLATION
Write-Host "📦 Installing fresh dependencies..." -ForegroundColor Yellow
pnpm install

# 3. QUALITY ASSURANCE
Write-Host "🧪 Running AI Matching Reliability Tests..." -ForegroundColor Yellow
pnpm test

# 4. UNIFIED BUILD
Write-Host "🏗️ Building Unified Distribution (Frontend + Backend)..." -ForegroundColor Yellow
pnpm build

# 5. DATABASE SYNC
Write-Host "🗄️ Database migration & seeding check..." -ForegroundColor Yellow
Write-Host "Note: Ensure DATABASE_URL is set in your environment variables." -ForegroundColor Gray
# pnpm db:push # Uncomment to auto-migrate schema

# 6. COMPLETION
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "✅ WINDOWS BUILD PREPARATION SUCCESSFUL!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🚀 BUILD READY IN: \dist"
Write-Host "🌐 FRONTEND IN: \dist\public"
Write-Host "⚙️ SERVER ENTRY: \dist\index.js"
Write-Host "`nTo start the production server locally:"
Write-Host "pnpm start"
Write-Host "==========================================================" -ForegroundColor Green
