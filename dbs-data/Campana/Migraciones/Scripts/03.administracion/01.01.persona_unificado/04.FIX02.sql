UPDATE direccion
SET
	id_tipo_georeferencia=532,
	calle = d2.referencia[1],
	altura = d2.referencia[2],
	piso = d2.referencia[3],
	dpto = d2.referencia[4],
	codigo_postal = d2.referencia[5],
	id_localidad = cast(d2.referencia[6] as bigint),
	id_provincia = cast(d2.referencia[7] as bigint),
	id_pais = cast(d2.referencia[8] as bigint)
FROM
	(select id, string_to_array(substring(referencia,2,length(referencia)-2),'][') referencia from direccion) d2
WHERE
	direccion.id=d2.id;