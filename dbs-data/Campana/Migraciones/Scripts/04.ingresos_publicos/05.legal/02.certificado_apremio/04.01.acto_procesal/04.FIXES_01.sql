UPDATE apremio set estado = 'DEMANDA INICIADA';

UPDATE apremio
SET
	estado = tap.descripcion
FROM
	(select id_apremio, max(id) id_acto_procesal_max from acto_procesal GROUP BY id_apremio) ap
	inner join acto_procesal apm on apm.id=id_acto_procesal_max
	inner join tipo_acto_procesal tap on apm.id_tipo_acto_procesal=tap.id
WHERE
	ap.id_apremio=apremio.id;
	
UPDATE apremio
SET
	fecha_inicio_demanda=fecha_desde_min
FROM
	(select id_apremio, min(fecha_desde) fecha_desde_min from acto_procesal GROUP BY id_apremio) ap
WHERE
	ap.id_apremio=apremio.id;

