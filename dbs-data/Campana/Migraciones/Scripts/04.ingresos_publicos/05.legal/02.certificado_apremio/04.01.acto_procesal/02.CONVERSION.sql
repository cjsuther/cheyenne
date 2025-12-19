USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE acto_procesal
GO

INSERT INTO acto_procesal
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.NUMERO_APREMIO,A.COD_TIPO_ACTO_PROCESAL,A.FECHA_DESDE)) id
	,apr.ID id_apremio
	,tap.ID id_tipo_acto_procesal
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
	,OBSERVACION
FROM MAJOR_CAMPANA.dbo.acto_procesal A
	left join LARAMIE_CAMPANA.dbo.apremio apr on apr.numero=A.NUMERO_APREMIO
	left join LARAMIE_CAMPANA.dbo.tipo_acto_procesal tap on tap.codigo_acto_procesal=A.COD_TIPO_ACTO_PROCESAL
ORDER BY id
GO

UPDATE acto_procesal SET fecha_desde=fecha_hasta WHERE fecha_desde is null
GO