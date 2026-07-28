-- Migración 012 — Ajustes E2 del módulo Presupuesto (idempotente)
ALTER TABLE presupuesto_jurisdicciones ALTER COLUMN tipo TYPE VARCHAR(30);
