#!/bin/bash
# scripts/backup-mongodb.sh

# Configuración (uses MONGO_URI from env if available in context, otherwise manual setup in VPS)
# For local dev simulation or manual run, ensure MONGO_URI is set or passed
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d-%H%M)
DB_NAME="petamigos"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

# Perform backup using mongodump
# Note: Requires mongodb-database-tools installed on the VPS
if [ -z "$MONGO_URI" ]; then
    echo "Error: MONGO_URI not set."
    exit 1
fi

echo "Starting backup for $DB_NAME at $DATE..."

mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/$DATE" --gzip

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_DIR/$DATE"
    # Optional: Delete backups older than 7 days
    find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} +
else
    echo "Backup failed!"
    exit 1
fi
