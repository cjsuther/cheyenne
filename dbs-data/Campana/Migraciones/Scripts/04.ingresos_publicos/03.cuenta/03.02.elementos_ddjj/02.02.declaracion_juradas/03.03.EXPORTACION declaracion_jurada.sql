USE LARAMIE_CAMPANA
GO

SELECT
	 id
	,id_cuenta
	,id_modelo_declaracion_jurada
	,fecha_presentacion_declaracion_jurada
	,anio_declaracion
	,mes_declaracion
	,numero
	,id_origen_declaracion_jurada
	,fecha_alta
	,fecha_baja
	,resolucion
FROM
	dbo.declaracion_jurada
ORDER BY
	id
GO
