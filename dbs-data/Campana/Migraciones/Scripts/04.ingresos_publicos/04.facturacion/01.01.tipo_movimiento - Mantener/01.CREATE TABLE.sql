USE LARAMIE_CAMPANA
GO

CREATE TABLE tipo_movimiento
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    act_emitido bit NOT NULL,
    automatico bit NOT NULL,
    autonumerado bit NOT NULL,
    numero bigint NOT NULL,
    imputacion varchar(20) NOT NULL,
    tipo varchar(20) NOT NULL
)
GO

ALTER TABLE tipo_movimiento ADD CONSTRAINT UQ_tipo_movimiento_codigo UNIQUE (codigo)
GO
