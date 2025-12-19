USE LARAMIE_CAMPANA
GO

SELECT
	id
    ,codigo
    ,nombre
    ,orden
    ,es_supervisor
    ,email
    ,direccion
    ,abogado
    ,oficial_justicia
    ,id_tipo_tributo
FROM tipo_controlador
ORDER BY id
