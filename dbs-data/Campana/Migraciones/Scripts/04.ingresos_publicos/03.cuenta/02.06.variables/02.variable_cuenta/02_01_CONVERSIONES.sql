USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE variable_cuenta
GO

INSERT INTO variable_cuenta
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_TRIBUTO,A.NUMERO_CUENTA,A.NOMBRE,A.FECHA_DESDE)) id
	,def.ID id_variable
	,cue.ID id_cuenta
	,ISNULL(A.VALOR,'') valor
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
FROM MAJOR_CAMPANA.dbo.VARIABLES_CUENTA A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.variable def on def.codigo=A.NOMBRE and def.id_tipo_tributo=tri.id
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
ORDER BY id
GO
