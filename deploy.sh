#!/bin/bash
# deploy.sh - Ejecutar en VPS Ubuntu 22.04 (Oracle Free Tier)

echo "🚀 Iniciando despliegue de PetAmigos en VPS..."

# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Docker
sudo apt install -y docker.io docker-compose

# 3. Instalar Caddy (si se usa fuera de Docker) o configurar Docker
# Aquí asumimos despliegue directo simple con Docker

# 4. Construir imagen
# Nota: En prod, idealmente se usa un registry (Docker Hub/GHCR),
# pero para free tier construcción local está bien si hay recursos.
echo "🏗️ Construyendo imagen Docker..."
sudo docker build -t petamigos-app .

# 5. Ejecutar contenedor
echo "🏃 Ejecutando contenedor..."
sudo docker stop petamigos || true
sudo docker rm petamigos || true
sudo docker run -d \
  --name petamigos \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  petamigos-app

# 6. Configurar Caddy (Reverse Proxy con HTTPS automático)
echo "🔒 Configurando Caddy para HTTPS..."
# Instalar Caddy si no existe
if ! command -v caddy &> /dev/null; then
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update
    sudo apt install caddy
fi

# Copiar Caddyfile
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy

echo "✅ Despliegue completado con éxito!"
