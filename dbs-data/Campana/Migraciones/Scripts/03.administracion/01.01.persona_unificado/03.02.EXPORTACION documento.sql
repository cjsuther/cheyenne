USE LARAMIE_CAMPANA
GO

SELECT
	id,
	500 id_tipo_persona,
	id id_persona,
	id_tipo_documento,
	numero_documento,
	1 principal
FROM persona_unificado
ORDER BY id
GO
