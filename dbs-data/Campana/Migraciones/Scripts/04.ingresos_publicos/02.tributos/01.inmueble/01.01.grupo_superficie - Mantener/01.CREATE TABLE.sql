USE LARAMIE_CAMPANA
GO

CREATE TABLE grupo_superficie
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL
)
GO

ALTER TABLE grupo_superficie ADD CONSTRAINT UQ_grupo_superficie_codigo UNIQUE (codigo)
GO