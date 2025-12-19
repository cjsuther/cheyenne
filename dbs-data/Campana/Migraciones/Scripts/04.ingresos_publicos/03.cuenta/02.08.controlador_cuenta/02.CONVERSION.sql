USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE controlador_cuenta
GO

INSERT INTO controlador_cuenta
SELECT 
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_TRIBUTO,A.NUMERO_CUENTA,A.COD_TIPO_CONTROLADOR,A.ID_CONTROLADOR)) id
	,cue.ID id_cuenta
    ,tco.ID id_tipo_controlador
	,A.ID_CONTROLADOR id_controlador
	,NULL fecha_desde
	,NULL fecha_hasta
FROM MAJOR_CAMPANA.dbo.CONTROLADOR_CUENTA A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
	left join LARAMIE_CAMPANA.dbo.tipo_controlador tco on tco.codigo=A.COD_TIPO_CONTROLADOR
	--left join LARAMIE_CAMPANA.dbo.controlador con on con.id=A.ID_CONTROLADOR and con.id_tipo_controlador=tco.id
ORDER BY
	id
GO
