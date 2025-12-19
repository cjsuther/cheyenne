USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE tipo_controlador
GO

INSERT INTO tipo_controlador
SELECT
	 CAST(COD_TIPO_CONTROLADOR AS INT) id 
	,COD_TIPO_CONTROLADOR codigo
	,DESCRIPCION nombre
	,ROW_NUMBER() OVER(ORDER BY COD_TIPO_CONTROLADOR) orden
	,(case when ES_SUPERVISOR = 'S' then 1 else 0 end) es_supervisor
		,0 email
		,0 direccion
		,0 abogado
		,0 oficial_justicia
		,NULL id_tipo_tributo
FROM MAJOR_CAMPANA.dbo.TIPO_CONTROLADOR
WHERE COD_TIPO_CONTROLADOR > 0
ORDER BY COD_TIPO_CONTROLADOR
GO
