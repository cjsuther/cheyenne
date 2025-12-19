USE LARAMIE_CAMPANA
GO

CREATE TABLE valuacion
(
    id bigint NOT NULL,
    id_inmueble bigint NOT NULL,
    id_tipo_valuacion bigint NOT NULL,
    ejercicio varchar(50) NOT NULL,
    mes integer NOT NULL,
    valor numeric(18,2) NOT NULL
)
GO
