USE LARAMIE_CAMPANA
GO

CREATE TABLE motivo_baja_rubro_comercio
(
    id bigint NOT NULL,
    codigo character varying(50)  NOT NULL,
    nombre character varying(250)  NOT NULL,
    orden integer NOT NULL,
    baja_con_deuda bit NOT NULL,
    baja_cancela_deuda bit NOT NULL
)
GO

ALTER TABLE motivo_baja_rubro_comercio ADD CONSTRAINT UQ_motivo_baja_rubro_comercio_codigo UNIQUE (codigo)
GO
