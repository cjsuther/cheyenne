-- Migración 005 — Variables por defecto de la emisión
-- ----------------------------------------------------------------------------
-- Permite que la emisión aporte las variables @I_* del padrón que el modelo de
-- datos aún no provee, para liquidar con el catálogo real. Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/005_emision_variables_default.sql
-- ----------------------------------------------------------------------------

ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS variables_default JSONB;
