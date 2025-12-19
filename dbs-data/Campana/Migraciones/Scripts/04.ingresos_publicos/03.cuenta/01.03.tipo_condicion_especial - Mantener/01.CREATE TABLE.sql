USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_condicion_especial
(
    id bigint NOT NULL,
    codigo varchar(50)  NOT NULL,
    nombre varchar(250)  NOT NULL,
    orden integer NOT NULL,
    id_tipo_tributo bigint,
    tipo varchar(250)  NOT NULL,
    color varchar(20)  NOT NULL,
    inhibicion bit NOT NULL
)
GO

ALTER TABLE tipo_condicion_especial ADD CONSTRAINT UQ_tipo_condicion_especial_codigo UNIQUE (codigo)
GO
