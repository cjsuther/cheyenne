USE LARAMIE_CAMPANA
GO

CREATE TABLE categoria_tasa
(
    id bigint NOT NULL,
    codigo varchar(50)  NOT NULL,
    nombre varchar(250)  NOT NULL,
    orden integer NOT NULL,
    es_plan bit NOT NULL,
    es_derecho_espontaneo bit NOT NULL
)
GO

ALTER TABLE categoria_tasa ADD CONSTRAINT UQ_categoria_tasa_codigo UNIQUE (codigo)
GO
