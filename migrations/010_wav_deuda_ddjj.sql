-- Fase 2 WAV: la DDJJ lleva su propia deuda (saldo) y los pagos/planes se aplican contra ella
ALTER TABLE wav_declaraciones_juradas
    ADD COLUMN IF NOT EXISTS saldo NUMERIC(18, 2) NOT NULL DEFAULT 0;

-- backfill: saldo = importe_total para las DDJJ ya presentadas sin saldo cargado
UPDATE wav_declaraciones_juradas SET saldo = importe_total WHERE saldo = 0 AND importe_total > 0;

ALTER TABLE wav_pagos_contado
    ADD COLUMN IF NOT EXISTS id_declaracion_jurada BIGINT;

ALTER TABLE wav_planes_pago
    ADD COLUMN IF NOT EXISTS id_declaracion_jurada BIGINT;
