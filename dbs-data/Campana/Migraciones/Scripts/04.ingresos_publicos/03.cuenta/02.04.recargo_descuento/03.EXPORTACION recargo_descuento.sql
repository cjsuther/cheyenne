USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_cuenta
      ,id_tipo_recargo_descuento
      ,id_tasa
      ,id_sub_tasa
      ,id_rubro
      ,fecha_desde
      ,fecha_hasta
      ,fecha_otorgamiento
      ,numero_solicitud
      ,porcentaje
      ,importe
      ,id_persona
      ,numero_ddjj
      ,letra_ddjj
      ,ejercicio_ddjj
      ,numero_decreto
      ,letra_decreto
      ,ejercicio_decreto
      ,id_expediente
      ,detalle_expediente
  FROM recargo_descuento
ORDER BY id
GO
