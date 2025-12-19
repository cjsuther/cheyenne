USE LARAMIE_CAMPANA
GO

SELECT
	id,
    id_certificado_apremio,
    id_tipo_relacion_certificado_apremio_persona,
    fecha_desde,
    fecha_hasta,
    id_persona
FROM certificado_apremio_persona
ORDER BY id
GO
