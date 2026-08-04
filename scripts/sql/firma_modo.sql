ALTER TABLE firma_firmas ADD COLUMN IF NOT EXISTS metodo VARCHAR(20) NOT NULL DEFAULT 'hmac';
ALTER TABLE firma_firmas ADD COLUMN IF NOT EXISTS aclaracion VARCHAR(200);
INSERT INTO firma_configuracion (id, modo, gendoc_url, tsa_url, updated_at)
VALUES (1, 'hmac', '', '', now())
ON CONFLICT (id) DO NOTHING;
