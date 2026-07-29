#!/usr/bin/env bash
# Aplicador de migraciones idempotente con tabla de tracking (schema_migrations).
# Reemplaza el estado roto anterior (alembic vacío + create_all + SQL sin aplicador).
#
# Uso (desde la raíz del repo, en el host con docker compose):
#   scripts/migrate.sh            -> aplica en orden SOLO las migraciones pendientes (registra cada una)
#   scripts/migrate.sh baseline   -> marca TODAS las migraciones actuales como aplicadas SIN ejecutarlas
#                                    (para adoptar el tracker en una DB donde ya se aplicaron a mano;
#                                     evita re-correr migraciones no idempotentes como 003_catalogo_formulas)
#   scripts/migrate.sh status     -> lista aplicadas y pendientes
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-apply}"

PSQL_BASE=(docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER:-cheyenne}" -d "${POSTGRES_DB:-cheyenne}")
psql_c() { "${PSQL_BASE[@]}" -q -tA -c "$1"; }

psql_c "CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());" >/dev/null

if [ "$MODE" = "status" ]; then
  echo "== aplicadas =="; psql_c "SELECT version FROM schema_migrations ORDER BY version;"
  echo "== pendientes =="
  for f in migrations/[0-9]*.sql; do
    v="$(basename "$f")"
    [ "$(psql_c "SELECT 1 FROM schema_migrations WHERE version='$v';" | tr -d '[:space:]')" = "1" ] || echo "$v"
  done
  exit 0
fi

processed=0; skipped=0
for f in migrations/[0-9]*.sql; do
  v="$(basename "$f")"
  exists="$(psql_c "SELECT 1 FROM schema_migrations WHERE version='$v';" | tr -d '[:space:]')"
  if [ "$exists" = "1" ]; then skipped=$((skipped+1)); continue; fi
  if [ "$MODE" = "baseline" ]; then
    psql_c "INSERT INTO schema_migrations(version) VALUES ('$v') ON CONFLICT DO NOTHING;" >/dev/null
    echo "baseline  $v"
  else
    echo "applying  $v"
    "${PSQL_BASE[@]}" < "$f" >/dev/null
    psql_c "INSERT INTO schema_migrations(version) VALUES ('$v');" >/dev/null
  fi
  processed=$((processed+1))
done
echo "migraciones (${MODE}): ${processed} procesadas, ${skipped} ya registradas"
