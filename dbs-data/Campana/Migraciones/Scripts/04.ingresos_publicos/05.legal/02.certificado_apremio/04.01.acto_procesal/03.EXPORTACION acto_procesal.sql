USE LARAMIE_CAMPANA
GO

SELECT
	id,
	id_apremio,
	id_tipo_acto_procesal,
	fecha_desde,
	fecha_hasta,
	observacion,
	0 recargos,
    0 honorarios,
    0 tasa_justicia,
    0 sobre_tasa_justicia,
    0 bono_ley,
    0 aportes,
    0 multasl
FROM acto_procesal
ORDER BY id
GO
