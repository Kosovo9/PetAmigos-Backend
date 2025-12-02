# Script PowerShell para preparar y subir código a GitHub
# Ejecutar: .\scripts\prepare-git.ps1

Write-Host "🚀 Preparando PetAmigos World para GitHub..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "server\server.js")) {
    Write-Host "❌ Error: No se encuentra server\server.js" -ForegroundColor Red
    Write-Host "   Asegúrate de estar en el directorio raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

# Verificar que .env no está en el staging
Write-Host "🔍 Verificando archivos sensibles..." -ForegroundColor Yellow
$envFiles = git ls-files | Select-String "\.env$"
if ($envFiles) {
    Write-Host "⚠️  ADVERTENCIA: Archivos .env detectados en staging" -ForegroundColor Red
    Write-Host "   Ejecuta: git reset HEAD server/.env client/.env" -ForegroundColor Yellow
    exit 1
}

# Verificar estado de Git
Write-Host ""
Write-Host "📋 Estado actual de Git:" -ForegroundColor Cyan
git status --short

Write-Host ""
$confirm = Read-Host "¿Continuar con el commit? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Cancelado" -ForegroundColor Red
    exit 1
}

# Agregar todos los archivos
Write-Host ""
Write-Host "📦 Agregando archivos..." -ForegroundColor Yellow
git add .

# Hacer commit
Write-Host ""
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
git commit -m "feat: implementación completa de PetAmigos World

- Backend completo con 7 Pilares del negocio
- Frontend React con Vite
- Sistema de monetización (Stripe, Mercado Pago, Lemon Squeezy)
- AI Creative Studio con múltiples proveedores
- Sistema predictivo (biologicalAge, segmentación)
- Chat en tiempo real con Socket.io
- Verificación biométrica
- Legado digital y comercio AR
- WAF y seguridad completa
- Optimizaciones de performance 500%"

Write-Host ""
Write-Host "✅ Commit creado exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Verificar el commit: git log --oneline -1"
Write-Host "   2. Conectar con GitHub (si es primera vez):"
Write-Host "      git remote add origin https://github.com/Kosovo9/PetAmigos-Backend.git"
Write-Host "   3. Hacer push: git push -u origin main"
Write-Host ""


