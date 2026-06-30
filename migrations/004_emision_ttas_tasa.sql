-- Migración 004 — La emisión apunta a una tasa del catálogo
-- ----------------------------------------------------------------------------
-- Columnas para que una emisión seleccione las FormulaTasa por tasa/sub-tasa
-- (catálogo real) en vez de por tipo_tributo. Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/004_emision_ttas_tasa.sql
-- ----------------------------------------------------------------------------

ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS ttas_tasa INTEGER;
ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS ttas_subtasa INTEGER DEFAULT 0;
