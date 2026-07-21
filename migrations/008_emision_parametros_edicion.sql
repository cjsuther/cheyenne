-- Migración 008 — Parámetros editables de la emisión (paso 2) + criterio de ordenamiento (7/12)
-- ----------------------------------------------------------------------------
-- Campos que el operador carga en el paso "Editar cálculo anterior" y en los pasos de
-- ordenamiento. Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/008_emision_parametros_edicion.sql
-- ----------------------------------------------------------------------------

ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS fecha_desde DATE;
ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS fecha_hasta DATE;
ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS numero_cuota INTEGER;
ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS criterio_seleccion TEXT;
ALTER TABLE emisiones_emisiones ADD COLUMN IF NOT EXISTS criterio_ordenamiento VARCHAR(120);
