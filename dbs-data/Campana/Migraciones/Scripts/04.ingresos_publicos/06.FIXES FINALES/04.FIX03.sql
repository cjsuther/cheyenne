INSERT INTO direccion(entidad, id_entidad, id_tipo_georeferencia, id_pais, id_provincia, id_localidad, id_zona_georeferencia, codigo_postal, calle, entre_calle_1, entre_calle_2, altura, piso, dpto, referencia, longitud, latitud)
SELECT 'Cartel', id, null, null, null, null, null, '', '', '', '', '', '', '', '', 0, 0
FROM cartel
WHERE NOT id IN (select id_entidad from direccion where entidad='Cartel');

INSERT INTO direccion(entidad, id_entidad, id_tipo_georeferencia, id_pais, id_provincia, id_localidad, id_zona_georeferencia, codigo_postal, calle, entre_calle_1, entre_calle_2, altura, piso, dpto, referencia, longitud, latitud)
SELECT 'LadoTerreno', id, null, null, null, null, null, '', '', '', '', '', '', '', '', 0, 0
FROM lado_terreno
WHERE NOT id IN (select id_entidad from direccion where entidad='LadoTerreno');

INSERT INTO direccion(entidad, id_entidad, id_tipo_georeferencia, id_pais, id_provincia, id_localidad, id_zona_georeferencia, codigo_postal, calle, entre_calle_1, entre_calle_2, altura, piso, dpto, referencia, longitud, latitud)
SELECT 'ZonaEntrega', id, null, null, null, null, null, '', '', '', '', '', '', '', '', 0, 0
FROM zona_entrega
WHERE NOT id IN (select id_entidad from direccion where entidad='ZonaEntrega');
