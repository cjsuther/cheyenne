-- Migración 020 — Retenciones sugeridas en la OP (Contaduría -> Tesorería punta a punta). Idempotente.
ALTER TABLE tesoreria_ordenes_pago ADD COLUMN IF NOT EXISTS retenciones_sugeridas TEXT;
