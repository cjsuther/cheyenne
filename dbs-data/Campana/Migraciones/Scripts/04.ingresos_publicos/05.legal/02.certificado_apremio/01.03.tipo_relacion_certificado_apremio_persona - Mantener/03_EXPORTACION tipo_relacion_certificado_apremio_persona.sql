USE LARAMIE_CAMPANA
GO

SELECT
	id,
	codigo,
	descripcion,
	id_tipo_controlador
FROM tipo_relacion_certificado_apremio_persona
ORDER BY id
GO
