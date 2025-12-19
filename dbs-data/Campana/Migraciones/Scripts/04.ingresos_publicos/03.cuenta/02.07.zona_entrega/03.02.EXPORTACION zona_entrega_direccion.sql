USE LARAMIE_CAMPANA
GO

--en postgresql se deberian borrar previamente los registros de direcciones con: delete from direccion where entidad='ZonaEntrega'
SELECT
    --id : debe ser gestionado por postgresql
    'ZonaEntrega' entidad,
    id id_entidad,
    0 id_tipo_georeferencia,
    0 id_pais,
    0 id_provincia,
    0 id_localidad,
    0 id_zona_georeferencia,
    '' codigo_postal,
    '' calle,
    '' entre_calle_1,
    '' entre_calle_2,
    '' altura,
    '' piso,
    '' dpto,
    direccion referencia,
    0 longitud,
    0 latitud,
    'MIGRACION' origen
FROM zona_entrega
WHERE LEN(email)=0 and direccion is not null and not direccion in ('[][0][][][][0][0][0]','[][0][0][][][0][0][0]','[][0][0][][00000000][0][0][0]','[][0][][][00000000][0][0][0]')
ORDER BY id
GO
