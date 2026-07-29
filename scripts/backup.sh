#!/usr/bin/env bash
# Backup de la base con pg_dump + gzip + retención. Pensado para correr por cron.
#   scripts/backup.sh
# Variables opcionales: BACKUP_DIR (default /root/cheyenne-backups), BACKUP_RETENTION_DAYS (default 14)
set -euo pipefail
cd "$(dirname "$0")/.."

DIR="${BACKUP_DIR:-/root/cheyenne-backups}"
RET="${BACKUP_RETENTION_DAYS:-14}"
mkdir -p "$DIR"
TS="$(date +%Y%m%d-%H%M%S)"
FILE="$DIR/cheyenne-${TS}.sql.gz"

# Dump consistente de toda la base (todos los schemas de los módulos)
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-cheyenne}" \
    --no-owner --clean --if-exists "${POSTGRES_DB:-cheyenne}" | gzip -9 > "$FILE"

SIZE="$(du -h "$FILE" | cut -f1)"
echo "$(date -Iseconds) backup OK -> $FILE ($SIZE)"

# Retención: borrar backups más viejos que RET días
DELETED="$(find "$DIR" -name 'cheyenne-*.sql.gz' -mtime +"$RET" -print -delete | wc -l)"
[ "$DELETED" -gt 0 ] && echo "retención: eliminados $DELETED backup(s) > ${RET} días"
exit 0
