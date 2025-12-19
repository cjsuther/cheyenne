USE LARAMIE_CAMPANA
GO

SELECT
     id
    ,id_tributo
    ,id_tipo_vinculo
    ,id_persona
    ,id_tipo_instrumento
    ,fecha_instrumento_desde
    ,fecha_instrumento_hasta
    ,porcentaje_condominio
FROM vinculo_cuenta
WHERE id_tipo_tributo=14
ORDER BY id
GO
