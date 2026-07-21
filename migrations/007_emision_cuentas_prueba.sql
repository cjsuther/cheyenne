-- Migración 007 — Cuentas de prueba de la emisión
-- ----------------------------------------------------------------------------
-- Guarda los ids de contribuyente que el operador usa para el cálculo de prueba
-- (paso 3 del workflow). Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/007_emision_cuentas_prueba.sql
-- ----------------------------------------------------------------------------

ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS cuentas_prueba JSONB;
