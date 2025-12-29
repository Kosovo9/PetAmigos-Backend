
#!/bin/bash
# scripts/emergency-restore.sh
# Restauración de emergencia desde backup.tar.gz

BACKUP_FILE=$1
PROJECT_DIR="/home/ubuntu/petamigos"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Error: Debes especificar el archivo de backup (.tar.gz)"
    exit 1
fi

echo "🚑 Iniciando Restauración de Emergencia..."

# 1. Descomprimir
mkdir -p /tmp/restore
tar -xzf $BACKUP_FILE -C /tmp/restore
BACKUP_NAME=$(basename $BACKUP_FILE .tar.gz)
SOURCE_DIR="/tmp/restore/$BACKUP_NAME"

# 2. Restaurar DB
echo "💾 Restaurando base de datos..."
MONGO_URI=$(grep MONGO_URI $PROJECT_DIR/server/.env | cut -d '=' -f2 | tr -d '"')
if [ -d "$SOURCE_DIR/mongo_dump" ] && [ -n "$MONGO_URI" ]; then
    mongorestore --uri="$MONGO_URI" "$SOURCE_DIR/mongo_dump"
fi

# 3. Restaurar Archivos
echo "📂 Restaurando uploads y config..."
cp -r $SOURCE_DIR/uploads/* $PROJECT_DIR/server/uploads/
cp $SOURCE_DIR/env_server $PROJECT_DIR/server/.env

# 4. Reiniciar Servicios
pm2 restart all

echo "✅ Restauración completada. Verifica el servicio."
rm -rf /tmp/restore
