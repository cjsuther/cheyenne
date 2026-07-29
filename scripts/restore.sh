#!/usr/bin/env bash
# Restaura la base desde un backup .sql.gz generado por backup.sh (disaster recovery).
#   scripts/restore.sh /root/cheyenne-backups/cheyenne-YYYYMMDD-HHMMSS.sql.gz
# ADVERTENCIA: sobrescribe la base actual (--clean en el dump). Confirmar antes.
set -euo pipefail
cd "$(dirname "$0")/.."

FILE="${1:-}"
[ -z "$FILE" ] && { echo "Uso: scripts/restore.sh <archivo.sql.gz>"; exit 1; }
[ -f "$FILE" ] || { echo "No existe el archivo: $FILE"; exit 1; }

echo "⚠  Vas a RESTAURAR '$FILE' sobre la base '${POSTGRES_DB:-cheyenne}' (se sobrescribe)."
read -r -p "Escribí 'restaurar' para continuar: " ok
[ "$ok" = "restaurar" ] || { echo "cancelado"; exit 1; }

gunzip -c "$FILE" | docker compose exec -T postgres psql -U "${POSTGRES_USER:-cheyenne}" -d "${POSTGRES_DB:-cheyenne}"
echo "restore completado desde $FILE"
