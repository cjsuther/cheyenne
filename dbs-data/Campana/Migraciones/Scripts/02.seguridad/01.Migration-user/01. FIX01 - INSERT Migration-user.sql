INSERT INTO usuario (
    id,
    id_tipo_usuario,
    id_estado_usuario,
    id_persona,
    codigo,
    nombre_apellido,
    email,
    fecha_alta,
    fecha_baja,
    identificador_firma_digital,
    id_oficina,
    imagen_firma_digital
)
VALUES (
    1,                             -- id
    1,                             -- id_tipo_usuario
    10,                            -- id_estado_usuario
    NULL,                          -- id_persona
    'migration',                   -- codigo
    'Migración Laramie',           -- nombre_apellido
    'migration@laramie.com',       -- email
    '2025-06-25 03:57:38.579',     -- fecha_alta
    NULL,                          -- fecha_baja
    NULL,                          -- identificador_firma_digital
    1,                             -- id_oficina
    NULL                           -- imagen_firma_digital
);
