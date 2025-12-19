USE LARAMIE_CAMPANA
GO

SELECT
	id,
    id_apremio,
    id_estado_certificado_apremio,
    numero,
    id_cuenta,
    id_inspeccion,
    monto_total,
    fecha_certificado,
    fecha_calculo,
    fecha_notificacion,
    fecha_recepcion,
	null id_firma_digital_titulo_ejecutivo,
	null id_estado_firma_titulo_ejecutivo,
	null id_cuenta_pago,
    false pago_habilitado
FROM certificado_apremio
ORDER BY id
GO
