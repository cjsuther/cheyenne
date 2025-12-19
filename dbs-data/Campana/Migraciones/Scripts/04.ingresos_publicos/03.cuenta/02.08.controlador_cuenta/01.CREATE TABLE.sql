USE LARAMIE_CAMPANA
GO

CREATE TABLE controlador_cuenta
(
    id bigint NOT NULL,
    id_cuenta bigint NULL,
    id_tipo_controlador bigint NOT NULL,
    id_controlador bigint NOT NULL,
    fecha_desde datetime NULL,
    fecha_hasta datetime NULL
)
GO
