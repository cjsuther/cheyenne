USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,baja_con_deuda
      ,baja_cancela_deuda
FROM motivo_baja_rubro_comercio
ORDER BY id
GO
