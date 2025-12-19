USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_controlador
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    es_supervisor bit NOT NULL,
    email bit NOT NULL,
    direccion bit NOT NULL,
    abogado bit NOT NULL,
    oficial_justicia bit NOT NULL,
    id_tipo_tributo bigint NULL
)
GO

ALTER TABLE tipo_controlador ADD CONSTRAINT UQ_tipo_controlador_codigo UNIQUE (codigo)
GO