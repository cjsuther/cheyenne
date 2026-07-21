-- Historial de pasos: guardar quién ejecutó cada paso (denormalizado desde seguridad)
ALTER TABLE emisiones_pasos_workflow
    ADD COLUMN IF NOT EXISTS usuario_nombre VARCHAR(150),
    ADD COLUMN IF NOT EXISTS usuario_codigo VARCHAR(50);
