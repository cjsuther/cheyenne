UPDATE persona_fisica
SET id_tipo_documento=l.id
FROM lista l
WHERE l.tipo='TipoDocumento' and l.codigo::bigint=id_tipo_documento;

UPDATE documento
SET id_tipo_documento=l.id
FROM lista l
WHERE l.tipo='TipoDocumento' and l.codigo::bigint=id_tipo_documento;
