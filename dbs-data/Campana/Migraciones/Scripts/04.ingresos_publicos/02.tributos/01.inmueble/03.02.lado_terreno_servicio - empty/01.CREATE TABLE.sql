USE LARAMIE_CAMPANA
GO

CREATE TABLE lado_terreno_servicio
(
    id bigint NOT NULL,
    id_lado_terreno bigint NOT NULL,
    id_tasa bigint NOT NULL,
    id_sub_tasa bigint NOT NULL,
    fecha_desde date NOT NULL,
    fecha_hasta date
)
GO
