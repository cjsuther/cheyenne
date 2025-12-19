USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_elemento
GO

INSERT INTO tipo_elemento
SELECT
	(ROW_NUMBER() OVER (ORDER BY dc.codigo)) id
	,dc.COD_CLASE cod_tasa
	,dc.codigo cod_subtasa
    ,dc.codigo
    ,dc.nombre
    ,(ROW_NUMBER() OVER (ORDER BY dc.codigo)) orden
    ,CE.id id_clase_elemento
    ,480 id_unidad_medida
	,1.00 valor
FROM
	MAJOR_CAMPANA.dbo.TIPO dc
	INNER JOIN LARAMIE_CAMPANA.dbo.clase_elemento AS CE ON CE.codigo=dc.COD_CLASE
ORDER BY id
GO