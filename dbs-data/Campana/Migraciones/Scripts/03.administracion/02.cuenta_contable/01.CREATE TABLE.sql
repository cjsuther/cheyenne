USE LARAMIE_CAMPANA
GO

CREATE TABLE cuenta_contable
(
    id bigint NOT NULL,
    codigo varchar(50) NOT NULL,
    nombre varchar(250) NOT NULL,
    orden integer NOT NULL,
    agrupamiento varchar(250) NOT NULL,
    ejercicio varchar(20) NOT NULL,
    tipo integer NOT NULL,
    ejercicio_agrupamiento varchar(20) NOT NULL,
    porcentaje_afectada numeric(18,2) NOT NULL,
    con_cheque_retencion bit NOT NULL,
    fecha_baja date
)
GO
