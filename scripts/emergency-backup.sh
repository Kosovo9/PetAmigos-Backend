
#!/bin/bash
# scripts/emergency-backup.sh
# Respaldo completo de emergencia (DB + Archivos + Config)

BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TARGET_DIR="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p $TARGET_DIR

echo "🚨 Iniciando Respaldo de Emergencia..."

# 1. Archivos Críticos (.env, uploads)
echo "📂 Copiando archivos..."
cp -r /home/ubuntu/petamigos/server/.env $TARGET_DIR/env_server
cp -r /home/ubuntu/petamigos/server/uploads $TARGET_DIR/uploads

# 2. Base de Datos (Mongodump)
# Nota: Requiere mongotools instalado, o usa script connection string URI
echo "💾 Exportando base de datos..."
# Si usamos Atlas, mongodump requiere URI. Asumimos URI en variable de entorno o .env
# Extraer MONGO_URI del .env
MONGO_URI=$(grep MONGO_URI /home/ubuntu/petamigos/server/.env | cut -d '=' -f2 | tr -d '"')

if [ -n "$MONGO_URI" ]; then
    mongodump --uri="$MONGO_URI" --out="$TARGET_DIR/mongo_dump"
else
    echo "⚠️ No se encontró MONGO_URI, saltando dump de DB."
fi

# 3. Comprimir todo
cd $BACKUP_DIR
tar -czf "backup_$TIMESTAMP.tar.gz" "backup_$TIMESTAMP"
rm -rf "backup_$TIMESTAMP"

echo "✅ Respaldo guardado en: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
