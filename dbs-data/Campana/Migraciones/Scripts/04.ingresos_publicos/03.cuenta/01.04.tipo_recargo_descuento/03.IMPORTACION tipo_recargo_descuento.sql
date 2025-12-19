USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,tipo
      ,id_tipo_tributo
      ,porcentaje
      ,importe
      ,emite_solicitud
      ,requiere_otrogamiento
      ,fecha_desde
      ,fecha_hasta
      ,procedimiento
FROM tipo_recargo_descuento
ORDER BY id
GO
