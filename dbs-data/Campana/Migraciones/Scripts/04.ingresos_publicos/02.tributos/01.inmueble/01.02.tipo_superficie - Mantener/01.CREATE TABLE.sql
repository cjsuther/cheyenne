USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_superficie
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    clase integer NOT NULL,
    suma varchar(20) NOT NULL,
    adicionales bit NOT NULL
)
GO

ALTER TABLE tipo_superficie ADD CONSTRAINT UQ_tipo_superficie_codigo UNIQUE (codigo)
GO
