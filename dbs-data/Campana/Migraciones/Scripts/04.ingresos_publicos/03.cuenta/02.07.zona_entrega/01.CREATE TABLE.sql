USE LARAMIE_CAMPANA
GO

CREATE TABLE zona_entrega
(
    id bigint NOT NULL,
    id_cuenta bigint NULL,
    id_tipo_controlador bigint NOT NULL,
    email varchar(250) NOT NULL,
    direccion varchar(250) NOT NULL
)
GO
