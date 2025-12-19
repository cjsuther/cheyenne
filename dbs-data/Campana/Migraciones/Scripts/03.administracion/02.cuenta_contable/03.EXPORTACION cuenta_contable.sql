USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,agrupamiento
      ,ejercicio
      ,tipo
      ,ejercicio_agrupamiento
      ,porcentaje_afectada
      ,con_cheque_retencion
      ,fecha_baja
FROM cuenta_contable
ORDER BY id
GO
