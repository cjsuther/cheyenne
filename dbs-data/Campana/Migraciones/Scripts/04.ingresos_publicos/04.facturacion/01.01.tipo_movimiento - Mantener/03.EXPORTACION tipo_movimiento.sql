USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,act_emitido
      ,automatico
      ,autonumerado
      ,numero
      ,imputacion
      ,tipo
FROM tipo_movimiento
ORDER BY id
GO
