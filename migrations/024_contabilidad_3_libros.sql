-- Migración 024 — Contabilidad 3 libros (RAFAM): columna 'libro' en asientos y reglas,
-- y unicidad de reglas por (tipo, libro) en vez de (tipo). Idempotente.
ALTER TABLE contabilidad_asientos ADD COLUMN IF NOT EXISTS libro VARCHAR(15) NOT NULL DEFAULT 'patrimonial';
ALTER TABLE contabilidad_reglas_imputacion ADD COLUMN IF NOT EXISTS libro VARCHAR(15) NOT NULL DEFAULT 'patrimonial';
ALTER TABLE contabilidad_reglas_imputacion DROP CONSTRAINT IF EXISTS uq_cont_regla_tipo;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_cont_regla_tipo_libro') THEN
    ALTER TABLE contabilidad_reglas_imputacion ADD CONSTRAINT uq_cont_regla_tipo_libro UNIQUE (tipo, libro);
  END IF;
END $$;
