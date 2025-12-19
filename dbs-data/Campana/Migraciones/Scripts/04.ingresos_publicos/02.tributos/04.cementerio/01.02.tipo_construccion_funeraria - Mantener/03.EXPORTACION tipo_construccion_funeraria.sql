USE LARAMIE_CAMPANA
GO

SELECT
	 id
	,codigo
	,nombre
	,orden
	,con_vencimiento
	,plazo_max_concesion
	,termino_concesion1
	,termino_concesion2
	,plazo_max_renovacion
	,termino_renovacion1
	,termino_renovacion2
	,tiene_ubicacion
	,tiene_superficie
FROM
	tipo_construccion_funeraria
ORDER BY
	id
GO
