---

# 1) Ver duplicados por documento **normalizado**

```sql
WITH norm AS (
  SELECT
    d.*,
    COALESCE(
      NULLIF(REGEXP_REPLACE(REGEXP_REPLACE(d.numero_documento, '\D', '', 'g'), '^0+', ''), ''),
      '0'
    ) AS numero_norm
  FROM documento d
  -- WHERE id_tipo_documento = 510  -- (opcional)
)
SELECT
  id_tipo_documento,
  numero_norm,
  COUNT(*) AS cantidad,
  ARRAY_AGG(id ORDER BY principal DESC, id)       AS ids,
  ARRAY_AGG(numero_documento ORDER BY id)         AS originales
FROM norm
GROUP BY id_tipo_documento, numero_norm
HAVING COUNT(*) > 1
ORDER BY id_tipo_documento, numero_norm;
```

---

# 2A) (Seguro) Generar DELETEs para revisar antes

Recomendado si se quiere inspeccionar qué se borraría. Mantiene 1 por grupo: prioriza `principal = true`, luego menor `id`.

```sql
WITH norm AS (
  SELECT
    d.*,
    COALESCE(
      NULLIF(REGEXP_REPLACE(REGEXP_REPLACE(d.numero_documento, '\D', '', 'g'), '^0+', ''), ''),
      '0'
    ) AS numero_norm
  FROM documento d
  -- WHERE id_tipo_documento = 510  -- (opcional)
),
ranked AS (
  SELECT
    n.*,
    ROW_NUMBER() OVER (
      PARTITION BY n.id_tipo_documento, n.numero_norm
      ORDER BY n.principal DESC, n.id ASC
    ) AS rn
  FROM norm n
)
SELECT
  'DELETE FROM documento WHERE id = ' || id || ';' AS delete_stmt,
  id, id_tipo_documento, numero_documento, numero_norm, principal
FROM ranked
WHERE rn > 1
ORDER BY id_tipo_documento, numero_norm, principal DESC, id;
```

Copiar/pegar las sentencias que devuelva (o filtrar aún más si se quiere).

---

# 2B) (Automático) Borrar duplicados en bloque

```sql
BEGIN;

WITH norm AS (
  SELECT
    d.*,
    COALESCE(
      NULLIF(REGEXP_REPLACE(REGEXP_REPLACE(d.numero_documento, '\D', '', 'g'), '^0+', ''), ''),
      '0'
    ) AS numero_norm
  FROM documento d
  -- WHERE id_tipo_documento = 510  -- (opcional)
),
ranked AS (
  SELECT
    n.*,
    ROW_NUMBER() OVER (
      PARTITION BY n.id_tipo_documento, n.numero_norm
      ORDER BY n.principal DESC, n.id ASC
    ) AS rn
  FROM norm n
)
DELETE FROM documento d
USING ranked r
WHERE d.id = r.id
  AND r.rn > 1;

COMMIT;
```

---

# 3) Normalizar **sin romper la unique**

Actualiza sólo los que, al normalizar, **no** chocan con otra fila del mismo `id_tipo_documento`.

```sql
BEGIN;

WITH norm AS (
  SELECT
    d.id, d.id_tipo_documento, d.numero_documento,
    COALESCE(
      NULLIF(REGEXP_REPLACE(REGEXP_REPLACE(d.numero_documento, '\D', '', 'g'), '^0+', ''), ''),
      '0'
    ) AS numero_norm
  FROM documento d
  -- WHERE id_tipo_documento = 510  -- (opcional)
),
safe AS (
  SELECT n1.id, n1.numero_norm
  FROM norm n1
  WHERE n1.numero_documento <> n1.numero_norm
    AND NOT EXISTS (
      SELECT 1
      FROM norm n2
      WHERE n2.id <> n1.id
        AND n2.id_tipo_documento = n1.id_tipo_documento
        AND n2.numero_norm = n1.numero_norm
    )
)
UPDATE documento d
SET numero_documento = s.numero_norm
FROM safe s
WHERE d.id = s.id;

COMMIT;
```

---

# 4) Verificación rápida

## 4.1) Ya no debería haber colisiones

```sql
WITH norm AS (
  SELECT
    id_tipo_documento,
    COALESCE(
      NULLIF(REGEXP_REPLACE(REGEXP_REPLACE(numero_documento, '\D', '', 'g'), '^0+', ''), ''),
      '0'
    ) AS numero_norm
  FROM documento
)
SELECT id_tipo_documento, numero_norm, COUNT(*) c
FROM norm
GROUP BY 1,2
HAVING COUNT(*) > 1
ORDER BY 1,2;
```

## 4.2) Muestra 20 documentos aún no normalizados (si quedara algo pendiente)

```sql
WITH norm AS (
  SELECT id, id_tipo_documento, numero_documento,
         REGEXP_REPLACE(REGEXP_REPLACE(numero_documento, '\D', '', 'g'), '^0+', '') AS numero_norm_raw
  FROM documento
)
SELECT *
FROM norm
WHERE numero_documento <> COALESCE(NULLIF(numero_norm_raw, ''), '0')
ORDER BY id
LIMIT 20;
```

---
