ALTER SEQUENCE declaracion_jurada_id_seq RESTART WITH 1500000;
ALTER SEQUENCE declaracion_jurada_item_id_seq RESTART WITH 15000000;

--agregar cabecera de ddjj migracion unificada
INSERT INTO declaracion_jurada (id_cuenta, id_modelo_declaracion_jurada, fecha_presentacion_declaracion_jurada, anio_declaracion, mes_declaracion, numero, id_origen_declaracion_jurada, fecha_alta, fecha_baja, resolucion)
SELECT
	ddjj.id_cuenta,
	ddjj.id_modelo_declaracion_jurada,
	now() fecha_presentacion_declaracion_jurada,
	'2000' anio_declaracion,
	1 mes_declaracion,
	'0' numero,
	2 id_origen_declaracion_jurada, --DE OFICIO
	now() fecha_alta,
	null fecha_baja,
	'MIGRACIÓN' resolucion
FROM
	migracion_ddjj() ddjj
GROUP BY
	ddjj.id_cuenta, ddjj.id_modelo_declaracion_jurada;

--agregar detalle de ddjj migracion unificada
INSERT INTO declaracion_jurada_item (id_cuenta, id_rubro, id_declaracion_jurada, id_clase_declaracion_jurada, id_tipo_declaracion_jurada, valor)
SELECT
	ddjj.id_cuenta,
	ddjj.id_rubro,
	cdj.id id_declaracion_jurada,
	ddjj.id_clase_declaracion_jurada,
	ddjj.id_tipo_declaracion_jurada,
	ddjj.valor
FROM
	migracion_ddjj() ddjj
	inner join declaracion_jurada cdj on
		cdj.id_cuenta=ddjj.id_cuenta and
		cdj.id_modelo_declaracion_jurada=ddjj.id_modelo_declaracion_jurada
WHERE
	cdj.anio_declaracion='2000' and
	cdj.mes_declaracion=1 and
	cdj.numero='0' and
	cdj.resolucion='MIGRACIÓN';
	
--baja a todo el resto de las ddjj
UPDATE declaracion_jurada
SET resolucion=resolucion||' [DDJJ ORIGINAL]', fecha_baja=now()
WHERE not id in (select cdj.id from declaracion_jurada cdj
	where
		cdj.anio_declaracion='2000' and
		cdj.mes_declaracion=1 and
		cdj.numero='0' and
		cdj.resolucion='MIGRACIÓN');

--borra funcion auxiliar
drop function migracion_ddjj;
