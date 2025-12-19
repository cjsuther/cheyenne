USE LARAMIE_CAMPANA
GO

SELECT 
     id
    ,id_tipo_documento
    ,numero_documento
    ,id_nacionalidad
    ,nombre
    ,apellido
    ,id_genero
    ,id_estado_civil
    ,id_nivel_estudio
    ,profesion
    ,matricula
    ,fecha_nacimiento
    ,fecha_defuncion
    ,discapacidad
    ,id_condicion_fiscal
    ,id_ingresos_brutos
    ,ganancias
    ,pin
    ,foto
FROM
    persona_unificado
ORDER BY
    id
