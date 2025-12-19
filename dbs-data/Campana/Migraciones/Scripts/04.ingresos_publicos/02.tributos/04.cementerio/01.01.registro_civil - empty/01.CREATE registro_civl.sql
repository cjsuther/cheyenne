USE LARAMIE
GO

CREATE TABLE registro_civil
(
    id bigint NOT NULL,
    codigo varchar(20) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden int NOT NULL
)
GO

ALTER TABLE registro_civil ADD CONSTRAINT UQ_registro_civil_codigo UNIQUE (codigo)
GO
