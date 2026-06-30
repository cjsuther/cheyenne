-- Migración 001 — Motor de cálculo de Rentas
-- ----------------------------------------------------------------------------
-- Columnas agregadas a tablas que YA existían. `Base.metadata.create_all` crea
-- tablas faltantes pero NO columnas nuevas en tablas existentes, así que hay que
-- correr este script en cada entorno (local y server) tras desplegar el motor.
-- Idempotente (IF NOT EXISTS): se puede correr varias veces sin efecto.
--
-- Uso:
--   docker compose exec -T postgres psql -U cheyenne -d cheyenne -f - < migrations/001_motor_calculo_columns.sql
-- ----------------------------------------------------------------------------

-- emisiones: padrón con la base imponible (datos_calculo) de cada cuenta
ALTER TABLE emisiones_padron_contribuyentes ADD COLUMN IF NOT EXISTS datos_calculo JSONB;

-- emisiones: liquidación con 4 vencimientos a_cancelar / a_pagar (port de CalcPagos)
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS id_tasa INTEGER;
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS id_sub_tasa INTEGER;
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS fort_numero INTEGER;
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS numero_vencimiento INTEGER;
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS a_cancelar NUMERIC(18,2) DEFAULT 0;
ALTER TABLE emisiones_liquidaciones ADD COLUMN IF NOT EXISTS a_pagar NUMERIC(18,2) DEFAULT 0;

-- ingresos_publicos: código de modelo del vehículo (cruce con el catálogo de valuación DNRPA)
ALTER TABLE ingresos_publicos_vehiculos ADD COLUMN IF NOT EXISTS codigo_modelo VARCHAR(50);

-- Nota: las tablas NUEVAS (emisiones_formula_tasa, ingresos_publicos_inmueble_valuaciones,
-- _superficies, _frentes, comercio_rubros, comercio_ddjj, vehiculo_valuaciones,
-- plan_pago_cuotas, etc.) las crea automáticamente Base.metadata.create_all al levantar
-- cada módulo; no requieren este script.
