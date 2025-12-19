USE LARAMIE_CAMPANA
GO

CREATE TABLE condicion_especial
(
    id bigint NOT NULL,
    id_cuenta integer NOT NULL,
    id_tipo_condicion_especial integer NOT NULL,
    fecha_desde date NOT NULL,
    fecha_hasta date
)
GO
