USE LARAMIE_CAMPANA
GO

CREATE TABLE origen_declaracion_jurada
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
	automatico int NOT NULL
)
GO

ALTER TABLE origen_declaracion_jurada ADD CONSTRAINT UQ_origen_declaracion_jurada_codigo UNIQUE (codigo)
GO