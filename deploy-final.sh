
#!/bin/bash
# deploy-final.sh — Despliegue TOTAL de PetAmigos en Oracle Free Tier
# Autor: Socio, Chihuahua, MX
# Ejecutar como: ./deploy-final.sh TU_DOMINIO TU_EMAIL MONGO_URI [OPCIONAL: VAPID_KEYS]

set -e

# === PARÁMETROS ===
DOMAIN="${1:-petamigos.duckdns.org}"
EMAIL="${2:-admin@petamigos.org}"
MONGO_URI="$3"

if [ -z "$MONGO_URI" ]; then
  echo "❌ Error: Debes proporcionar MONGO_URI como tercer argumento."
  echo "Uso: ./deploy-final.sh midominio.com email@ejemplo.com 'mongodb+srv://...'"
  exit 1
fi

echo "🚀 Iniciando Despliegue Maestro de PetAmigos en $DOMAIN..."

# 1. Instalar dependencias del sistema
echo "📦 Instalando dependencias base (Node, Caddy, PM2)..."
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# Instalar Caddy (Servidor Web + HTTPS auto)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy

# Instalar PM2 globalmente
sudo npm install -g pm2

# 2. Preparar Directorio
PROJECT_DIR="/home/ubuntu/petamigos"
mkdir -p $PROJECT_DIR
mkdir -p $PROJECT_DIR/server
mkdir -p $PROJECT_DIR/client

# Nota: Asumimos que los archivos ya están copiados o se clonan del repo.
# Si este script se corre DESPUES de subir los archivos, saltamos clonación.
# echo "📂 Copiando archivos (asumiendo que estás en el directorio del proyecto)..."
# (Esto se debería hacer via scp o git clone antes de correr el script si es fresh install)

# 3. Backend Setup
echo "🔧 Configurando Backend..."
cd $PROJECT_DIR/server
npm ci --production
# Crear .env seguro
cat > .env <<EOF
PORT=5000
MONGO_URI="$MONGO_URI"
NODE_ENV=production
CLIENT_URL="https://$DOMAIN"
JWT_SECRET=$(openssl rand -hex 32)
VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY:-""}
VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY:-""}
EOF

# 4. Frontend Build
echo "🎨 Construyendo Frontend..."
cd $PROJECT_DIR/client
npm ci
cat > .env.production <<EOF
VITE_API_URL="https://$DOMAIN/api"
VITE_VAPID_PUBLIC_KEY="${VAPID_PUBLIC_KEY:-""}"
EOF
npm run build

# 5. Configurar Caddy (Reverse Proxy + HTTPS)
echo "🔒 Configurando HTTPS con Caddy..."
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    # Frontend (SPA)
    root * $PROJECT_DIR/client/dist
    file_server
    try_files {path} /index.html

    # Backend API
    handle /api/* {
        reverse_proxy localhost:5000
    }
    
    # Uploads (Stories, Avatars)
    handle /uploads/* {
        root * $PROJECT_DIR/server
        file_server
    }

    # Compresión
    encode gzip
}
EOF

sudo systemctl reload caddy

# 6. Iniciar Aplicación con PM2
echo "🔥 Encendiendo motores..."
cd $PROJECT_DIR/server
pm2 delete petamigos || true
pm2 start server.js --name "petamigos"
pm2 save
pm2 startup | tail -n 1 | bash || true

echo "✅ ¡DESPLIEGUE FINAL COMPLETADO!"
echo "🌍 Tu aplicación está viva en: https://$DOMAIN"
echo "🛡️ Admin Panel ready."
