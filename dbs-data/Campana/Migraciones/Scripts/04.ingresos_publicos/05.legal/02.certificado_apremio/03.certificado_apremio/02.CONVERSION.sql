USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE certificado_apremio
GO

INSERT INTO certificado_apremio
SELECT
	NUMERO_CERTIFICADO id,
	NUMERO_APREMIO id_apremio,
	ISNULL(est.ID,400) id_estado_certificado_apremio, --400: Calculado
	NUMERO_CERTIFICADO numero,
	cue.ID id_cuenta,
	null id_inspeccion,
	MONTO_TOTAL,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_CERTIFICADO) fecha_certificado,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_CALCULO) fecha_calculo,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_NOTIFICACION) fecha_notificacion,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_RECEPCION) fecha_recepcion
FROM
	MAJOR_CAMPANA.dbo.CERTIFICADO_APREMIO A
	left join MAJOR_CAMPANA.dbo.LISTA est on est.NOMBRE='EstadoCertificadoApremio' and est.CODIGO=A.COD_ESTADO_CERTIFICADO_APREMIO
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
WHERE NUMERO_CERTIFICADO>0
ORDER BY id
GO
