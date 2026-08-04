-- 025_firma_usuario.sql
-- Credencial de firma por usuario (clave de firma / PIN + aclaracion).
-- Equivalente al certificado/token por usuario del legacy.
-- Idempotente.

ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS clave_firma_hash VARCHAR(200);
ALTER TABLE seguridad_usuarios ADD COLUMN IF NOT EXISTS aclaracion_firma VARCHAR(200);
