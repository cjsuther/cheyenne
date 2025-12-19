USE LARAMIE_CAMPANA
GO

CREATE TABLE certificado_apremio
(
	id bigint NOT NULL,
    id_apremio bigint NULL,
    id_estado_certificado_apremio bigint NOT NULL,
    numero VARCHAR(20) NOT NULL,
    id_cuenta bigint NOT NULL,
    id_inspeccion bigint NULL,
    monto_total numeric(18,2) NOT NULL,
    fecha_certificado datetime NULL,
    fecha_calculo datetime NULL,
    fecha_notificacion datetime NULL,
    fecha_recepcion datetime NULL,
)
GO
