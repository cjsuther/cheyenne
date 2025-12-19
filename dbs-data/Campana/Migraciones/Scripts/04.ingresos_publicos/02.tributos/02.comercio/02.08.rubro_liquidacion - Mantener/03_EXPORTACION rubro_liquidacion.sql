USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,numera
      ,numero
      ,reliquida
FROM rubro_liquidacion
ORDER BY id
GO
