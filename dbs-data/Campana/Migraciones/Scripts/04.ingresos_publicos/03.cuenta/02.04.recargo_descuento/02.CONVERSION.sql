USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE recargo_descuento
GO

INSERT INTO recargo_descuento
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_TRIBUTO,A.NUMERO_CUENTA,A.COD_TIPO_RECARGO_DESCUENTO,A.COD_RUBRO)) id
	,cue.ID id_cuenta
	,trd.ID id_tipo_recargo_descuento
	,tas.ID id_tasa
	,stas.ID id_sub_tasa
	,rub.ID id_rubro
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_OTORGAMIENTO) fecha_otorgamiento
	,NUMERO_SOLICITUD numero_solicitud
	,ABS(A.PORCENTAJE) porcentaje
	,ABS(A.IMPORTE) importe
	,per_sol.ID id_persona
	,NUMERO_DDJJ
	,LETRA_DDJJ
	,EJERCICIO_DDJJ
	,NUMERO_DECRETO
	,LETRA_DECRETO
	,EJERCICIO_DECRETO
	,NULL id_expediente
	,MAJOR_CAMPANA.dbo.GET_EXPEDIENTE(EXPEDIENTE_EJERCICIO,EXPEDIENTE_NUMERO,EXPEDIENTE_SUBNUMERO,EXPEDIENTE_LETRA,EXPEDIENTE_MATRICULA,EXPEDIENTE_TIPO) detalle_expediente
FROM MAJOR_CAMPANA.dbo.RECARGO_DESCUENTO A
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
	left join LARAMIE_CAMPANA.dbo.tipo_recargo_descuento trd on trd.codigo=A.COD_TIPO_RECARGO_DESCUENTO
	left join LARAMIE_CAMPANA.dbo.tasa tas on tas.codigo=A.COD_TASA
	left join LARAMIE_CAMPANA.dbo.sub_tasa stas on stas.codigo=A.COD_SUBTASA and stas.id_tasa=tas.id
	left join LARAMIE_CAMPANA.dbo.rubro rub on rub.codigo=A.COD_RUBRO
	left join LARAMIE_CAMPANA.dbo.persona_unificado per_sol on per_sol.tipo_persona=A.COD_TIPO_PERSONA_COLICITANTE and per_sol.numero_documento=A.ID_PERSONA_SOLICITANTE
ORDER BY id
GO
