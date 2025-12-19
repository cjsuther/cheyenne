BEGIN;

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
  FROM persona
)
UPDATE persona p
SET numero_documento =
  lpad(p.numero_documento::text,
       length(p.numero_documento::text) + (r.rn - 1)::int,
       '0')
FROM ranked r
WHERE p.id = r.id
  AND r.cnt > 1
  AND r.rn > 1;

-- Verificación final: no deberían quedar duplicados
SELECT id_tipo_documento, numero_documento, COUNT(*) AS cantidad
FROM persona
GROUP BY id_tipo_documento, numero_documento
HAVING COUNT(*) > 1;

COMMIT;
