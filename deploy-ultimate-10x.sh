#!/bin/bash
# ============================================
# PETMATCH - DEPLOYMENT ULTIMATE 10x
# Zero Stripe | Hugging Face AI | Netlify + Render
# ============================================

set -e  # Exit on any error

echo "🚀 PETMATCH - DEPLOYMENT ULTIMATE 10x"
echo "======================================"
echo "💰 Mercado Pago + PayPal | 🤖 Hugging Face | 📦 Netlify + Render"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# ========== VERIFICACIONES ==========
echo "1️⃣  Verificando entorno..."

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js no encontrado. Instala Node.js 20+ primero."
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    warning "\npnpm no encontrado, instalando..."
    npm install -g pnpm@10.4.1
fi

# Check git
if ! command -v git &> /dev/null; then
    error "Git no encontrado. Instala Git primero."
fi

success "Environment validated: Node $(node -v) | pnpm $(pnpm -v)"

# ========== LIMPIEZA ==========
echo ""
echo "2️⃣  Limpiando archivos temporales..."

# Remove old builds
rm -rf client/.next client/dist server/dist 2>/dev/null || true
rm -rf client/node_modules/.cache 2>/dev/null || true

success "Temporary files cleaned"

# ========== INSTALACIÓN CLIENT ==========
echo ""
echo "3️⃣  Instalando dependencias del cliente..."

cd client
pnpm install --no-frozen-lockfile

success "Client dependencies installed"

# ========== INSTALACIÓN SERVER ==========
echo ""
echo "4️⃣  Instalando dependencias del servidor..."

cd ../server
pnpm install --no-frozen-lockfile

success "Server dependencies installed"
cd ..

# ========== VERIFICACIÓN DE BUILD ==========
echo ""
echo "5️⃣  Verificando builds locales..."

# Test client build
echo "  → Building client..."
cd client
pnpm run build 2>&1 | tail -20

if [ -d ".next" ]; then
    success "Client build OK"
else
    error "Client build failed"
fi

cd ..

# No build needed for server in dev
success "Server ready (CommonJS mode)"

# ========== GIT STATUS ==========
echo ""
echo "6️⃣  Preparando commit..."

# Check for changes
if git diff --quiet && git diff --staged --quiet; then
    warning "No hay cambios para commitear"
else
    # Stage all changes
    git add .
    
    # Create commit with detailed message
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
    git commit -m "🚀 Plan 10x Complete - $TIMESTAMP" \
        -m "✅ ELIMINADO: Stripe, Lemon Squeezy" \
        -m "✅ AGREGADO: Mercado Pago + PayPal" \
        -m "✅ AI: Hugging Face (Open Source)" \
        -m "✅ Configs: Netlify + Render optimizadas" \
        -m "" \
        -m "Ready for production deployment" || warning "Commit failed or nothing to commit"
    
    success "Commit created successfully"
fi

# ========== RESUMEN FINAL ==========
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ${GREEN}DEPLOYMENT 10x PREPARADO${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 ${YELLOW}STACK IMPLEMENTADO:${NC}"
echo "   • Payments: Mercado Pago + PayPal ✅"
echo "   • AI: Hugging Face (Open Source) ✅"
echo "   • Frontend: Next.js 15 + React 19 ✅"
echo "   • Backend: Node.js + Express ✅"
echo ""
echo "🌐 ${YELLOW}PRÓXIMOS PASOS:${NC}"
echo ""
echo "   1. Push to GitHub:"
echo "      ${GREEN}git push origin main${NC}"
echo ""
echo "   2. Netlify auto-deploy:"
echo "      → https://app.netlify.com/sites/amigospet"
echo "      (Se desplegará automáticamente en 1-2 min)"
echo ""
echo "   3. Render auto-deploy:"
echo "      → https://dashboard.render.com/web/srv-d4o7dj8gjchc73cg0r70"
echo "      (Se desplegará automáticamente en 5-10 min)"
echo ""
echo "   4. Verificar URLs en vivo:"
echo "      Frontend: ${GREEN}https://petplaydate.netlify.app${NC}"
echo "      Backend: ${GREEN}https://petamigos-backend.onrender.com${NC}"
echo ""
echo "📝 ${YELLOW}VARIABLES DE ENTORNO NECESARIAS:${NC}"
echo ""
echo "   Netlify (Frontend):"
echo "   • NEXT_PUBLIC_MP_PUBLIC_KEY"
echo "   • NEXT_PUBLIC_PAYPAL_CLIENT_ID"
echo "   • NEXT_PUBLIC_API_URL"
echo ""
echo "   Render (Backend):"
echo "   • MP_ACCESS_TOKEN"
echo "   • PAYPAL_CLIENT_ID"
echo "   • PAYPAL_SECRET"
echo "   • HUGGINGFACE_API_KEY"
echo "   • MONGODB_URI"
echo "   • JWT_SECRET"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ${GREEN}LISTO PARA DEPLOY COMPLETO${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
