USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE condicion_especial
GO

INSERT INTO condicion_especial
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_TRIBUTO,A.NUMERO_CUENTA,A.COD_TIPO_CONDICION_ESPECIAL)) id
	,cue.ID id_cuenta
	,tce.ID id_tipo_condicion_especial
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
FROM MAJOR_CAMPANA.dbo.CONDICION_ESPECIAL A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
	left join LARAMIE_CAMPANA.dbo.tipo_condicion_especial tce on tce.codigo=A.COD_TIPO_CONDICION_ESPECIAL
ORDER BY id
GO
