USE LARAMIE_CAMPANA
GO

CREATE TABLE observacion_cementerio
(
    id bigint NOT NULL,
    entidad varchar(50) NOT NULL,
    id_entidad bigint NOT NULL,
    detalle varchar(1000) NOT NULL,
    id_usuario bigint NOT NULL,
    fecha datetime NOT NULL
)
GO
