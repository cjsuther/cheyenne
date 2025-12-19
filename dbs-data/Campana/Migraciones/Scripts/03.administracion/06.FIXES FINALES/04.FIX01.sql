INSERT INTO direccion(entidad, id_entidad, id_tipo_georeferencia, id_pais, id_provincia, id_localidad, id_zona_georeferencia, codigo_postal, calle, entre_calle_1, entre_calle_2, altura, piso, dpto, referencia, longitud, latitud, origen)
SELECT 'PersonaFisica', id, null, null, null, null, null, '', '', '', '', '', '', '', '', 0, 0, ''
FROM persona_fisica
WHERE NOT id IN (select id_entidad from direccion where entidad='PersonaFisica');