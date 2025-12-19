USE LARAMIE_CAMPANA
GO

CREATE TABLE categoria_ubicacion
(
    id bigint identity NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    coeficiente numeric(18,2) NOT NULL
)
GO
