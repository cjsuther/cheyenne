USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE certificado_apremio_persona
GO

INSERT INTO certificado_apremio_persona
SELECT
	ROW_NUMBER() OVER (ORDER BY A.NUMERO_CERTIFICADO,A.COD_TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA,A.COD_TIPO_PERSONA_RELACION,A.ID_PERSONA_RELACION,A.FECHA_DESDE) id,
	cer.ID id_certificado_apremio,
	trcap.ID id_tipo_relacion_certificado_apremio_persona,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_desde,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_hasta,
	per_sol.ID id_persona
FROM
	MAJOR_CAMPANA.dbo.CERTIFICADO_APREMIO_PERSONA A
	left join LARAMIE_CAMPANA.dbo.certificado_apremio cer on cer.numero=A.NUMERO_CERTIFICADO
	left join LARAMIE_CAMPANA.dbo.tipo_relacion_certificado_apremio_persona trcap on trcap.codigo=A.COD_TIPO_RELACION_CERTIFICADO_APREMIO_PERSONA
	left join LARAMIE_CAMPANA.dbo.persona_unificado per_sol on per_sol.tipo_persona=A.COD_TIPO_PERSONA_RELACION and per_sol.numero_documento=A.ID_PERSONA_RELACION
ORDER BY id
GO
