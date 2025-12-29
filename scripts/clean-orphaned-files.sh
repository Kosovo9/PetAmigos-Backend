
#!/bin/bash
# scripts/clean-orphaned-files.sh
# Limpia imágenes huérfanas en /uploads

PROJECT_ROOT="/home/ubuntu/petamigos"

# Directorios a limpiar
# Esto iteraría sobre archivos físicos y comprobaría si existen en DB.
# Para esta implementación 100% offline y simple, nos enfocaremos en limpiar thmp/temp si existen
# o archivos de stories via el TTL de mongo ya se borran de DB, aqui podriamos borrar las imagenes fisicas.

echo "🧹 Iniciando limpieza de archivos..."
find uploads/stories -type f -mmin +1440 -delete # Borrar archivos de stories > 24h (1440 mins)

echo "✅ Limpieza completada."
