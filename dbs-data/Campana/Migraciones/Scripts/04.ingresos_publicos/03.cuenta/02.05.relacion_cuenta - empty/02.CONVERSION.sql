USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE relacion_cuenta
GO

INSERT INTO relacion_cuenta
SELECT
	(ROW_NUMBER() OVER (ORDER BY COD_TIPO_TRIBUTO_1,NUMERO_CUENTA_1,COD_TIPO_TRIBUTO_2,NUMERO_CUENTA_2)) id
	,cue1.ID id_cuenta_1
	,cue2.ID id_cuenta_2
FROM MAJOR_CAMPANA.dbo.RELACION_ENTRE_CUENTAS A
	left join MAJOR_CAMPANA.dbo.LISTA tri1 on tri1.NOMBRE='TipoTributo' and tri1.CODIGO=A.COD_TIPO_TRIBUTO_1
	left join MAJOR_CAMPANA.dbo.LISTA tri2 on tri2.NOMBRE='TipoTributo' and tri2.CODIGO=A.COD_TIPO_TRIBUTO_2
	left join LARAMIE_CAMPANA.dbo.cuenta cue1 on cue1.numero_cuenta=A.NUMERO_CUENTA_1 and cue1.id_tipo_tributo=tri1.id
	left join LARAMIE_CAMPANA.dbo.cuenta cue2 on cue2.numero_cuenta=A.NUMERO_CUENTA_2 and cue2.id_tipo_tributo=tri2.id
ORDER BY id
GO
