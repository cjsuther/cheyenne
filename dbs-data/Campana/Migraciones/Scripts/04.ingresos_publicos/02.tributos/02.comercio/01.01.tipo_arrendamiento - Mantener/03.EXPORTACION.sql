USE LARAMIE
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,id_tasa_inicial_renovacion
      ,id_sub_tasa_inicial_renovacion
      ,id_tasa_transferencia
      ,id_sub_tasa_transferencia
      ,id_tasa_mensual
      ,id_sub_tasa_mensual
      ,id_tasa_expensas
      ,id_sub_tasa_expensas
      ,id_sub_tasa_varios
      ,es_embarcacion
  FROM tipo_arrendamiento

GO


