USE LARAMIE_CAMPANA
GO

SELECT
	id,
	id_tipo_acto_procesal,
	codigo_acto_procesal,
	descripcion,
	plazo_dias,
	porcentaje_honorarios,
	fecha_baja,
	nivel,
	orden
FROM tipo_acto_procesal
ORDER BY id
GO
