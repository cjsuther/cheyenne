USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,id_tipo_tributo
      ,tipo
      ,color
      ,inhibicion
FROM tipo_condicion_especial
ORDER BY id
GO
