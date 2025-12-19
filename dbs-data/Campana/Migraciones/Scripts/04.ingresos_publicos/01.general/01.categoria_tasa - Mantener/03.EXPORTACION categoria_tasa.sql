USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,es_plan
      ,es_derecho_espontaneo
FROM categoria_tasa
ORDER BY id
GO
