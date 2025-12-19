USE LARAMIE_CAMPANA
GO

CREATE TABLE obra
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    importe numeric(18,2) NOT NULL,
    id_tipo_obra bigint
)
GO