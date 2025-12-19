USE LARAMIE_CAMPANA
GO

SELECT
      id,
      id_cuenta,
      id_tasa,
      id_sub_tasa,
      id_rubro,
      id_tipo_solicitud_debito_automatico,
      numero_solicitud_debito_automatico,
      id_medio_pago,
      detalle_medio_pago,
      fecha_desde,
      fecha_alta,
      fecha_baja,
      id_entidad_recaudadora
FROM debito_automatico
ORDER BY id
GO
