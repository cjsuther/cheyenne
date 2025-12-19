USE LARAMIE_CAMPANA
GO

--declaracion_jurada
TRUNCATE TABLE declaracion_jurada
GO

INSERT INTO declaracion_jurada
SELECT
	ROW_NUMBER() OVER (ORDER BY id_tipo_tributo, id_cuenta, periodo, mes, numero) id,
	id_tipo_tributo,
	id_cuenta,
	1 id_modelo_declaracion_jurada,
	max(fecha_alta) fecha_presentacion_declaracion_jurada,
	periodo anio_declaracion,
	mes mes_declaracion,
	numero,
	id_origen_declaracion_jurada,
	max(fecha_alta) fecha_alta,
	max(fecha_baja) fecha_baja,
	resolucion
FROM elemento e
GROUP BY id_tipo_tributo, id_cuenta, periodo, mes, numero, id_origen_declaracion_jurada, resolucion
ORDER BY id
GO

--declaracion_jurada_item
TRUNCATE TABLE declaracion_jurada_item
GO

INSERT INTO declaracion_jurada_item
SELECT
	ROW_NUMBER() OVER (ORDER BY e.id_tipo_tributo, e.id_cuenta, e.periodo, e.mes, e.numero, id_rubro, id_clase_elemento, id_tipo_elemento) id,
	e.id_cuenta,
	r.id id_rubro,
	dj.id id_declaracion_jurada,
	e.id_clase_elemento id_clase_declaracion_jurada,
	e.id_tipo_elemento id_tipo_declaracion_jurada,
	e.cantidad valor
FROM dbo.elemento e
	INNER JOIN dbo.declaracion_jurada DJ
		ON	dj.id_tipo_tributo=e.id_tipo_tributo and dj.id_cuenta=e.id_cuenta and
			dj.anio_declaracion=e.periodo and dj.mes_declaracion=e.mes and
			dj.numero=e.numero and dj.id_origen_declaracion_jurada=e.id_origen_declaracion_jurada
	LEFT JOIN dbo.rubro r ON r.id=e.id_rubro
ORDER BY id
GO