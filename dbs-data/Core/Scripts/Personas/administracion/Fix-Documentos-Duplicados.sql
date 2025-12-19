BEGIN;

-- 0) (Opcional) Inspección previa: ¿a cuántos afectaría?
WITH ranked AS (
  SELECT
    id,
    id_tipo_documento,
    numero_documento,
    ROW_NUMBER() OVER (
      PARTITION BY id_tipo_documento, numero_documento
      ORDER BY id
    ) AS rn,
    COUNT(*) OVER (
      PARTITION BY id_tipo_documento, numero_documento
    ) AS cnt
  FROM documento
)
SELECT COUNT(*) AS filas_a_modificar
FROM ranked
WHERE cnt > 1 AND rn > 1;

-- 1) Guard check: verificar que la "propuesta" no genere NUEVOS choques
--    (por ejemplo, que el valor con ceros no coincida con alguna otra fila existente).
WITH ranked AS (
  SELECT
    id,
    id_tipo_documento,
    numero_documento,
    ROW_NUMBER() OVER (
      PARTITION BY id_tipo_documento, numero_documento
      ORDER BY id
    ) AS rn,
    COUNT(*) OVER (
      PARTITION BY id_tipo_documento, numero_documento
    ) AS cnt
  FROM documento
),
propuesto AS (
  SELECT
    r.id,
    r.id_tipo_documento,
    CASE
      WHEN r.rn = 1 THEN d.numero_documento::text
      ELSE lpad(d.numero_documento::text,
                length(d.numero_documento::text) + (r.rn - 1)::int,
                '0')
    END AS nuevo_numero
  FROM ranked r
  JOIN documento d ON d.id = r.id
  WHERE r.cnt > 1
),
choques AS (
  -- Contar ocurrencias por (tipo, nuevo_numero) contemplando TODAS las filas:
  SELECT
    p.id_tipo_documento,
    p.nuevo_numero,
    (
      SELECT COUNT(*)
      FROM (
        -- todas las filas existentes (sin cambio) + las propuestas para duplicados
        SELECT d.id_tipo_documento, d.numero_documento::text AS valor
        FROM documento d

        UNION ALL

        SELECT p2.id_tipo_documento, p2.nuevo_numero
        FROM propuesto p2
      ) z
      WHERE z.id_tipo_documento = p.id_tipo_documento
        AND z.valor = p.nuevo_numero
    ) AS total_tras_cambio
  FROM (SELECT DISTINCT id_tipo_documento, nuevo_numero FROM propuesto) p
)
-- Si esto devuelve filas, hay un choque potencial. Revisa antes de continuar.
SELECT *
FROM choques
WHERE total_tras_cambio > 1;
-- Esperado: 0 filas. Si hay filas, ejecuta ROLLBACK y revisa.

-- 2) Aplicar actualización: prefijar ceros a partir de la 2.ª fila en cada grupo
WITH ranked AS (
  SELECT
    id,
    id_tipo_documento,
    numero_documento,
    ROW_NUMBER() OVER (
      PARTITION BY id_tipo_documento, numero_documento
      ORDER BY id
    ) AS rn,
    COUNT(*) OVER (
      PARTITION BY id_tipo_documento, numero_documento
    ) AS cnt
  FROM documento
)
UPDATE documento d
SET numero_documento =
  lpad(d.numero_documento::text,
       length(d.numero_documento::text) + (r.rn - 1)::int,
       '0')
FROM ranked r
WHERE d.id = r.id
  AND r.cnt > 1
  AND r.rn > 1;

-- 3) Verificación final: no deberían quedar duplicados
SELECT id_tipo_documento, numero_documento, COUNT(*) AS cantidad
FROM documento
GROUP BY id_tipo_documento, numero_documento
HAVING COUNT(*) > 1;

COMMIT;
