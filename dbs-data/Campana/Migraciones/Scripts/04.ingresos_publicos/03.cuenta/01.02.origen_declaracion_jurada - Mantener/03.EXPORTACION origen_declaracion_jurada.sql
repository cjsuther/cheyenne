USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
	  ,automatico
FROM origen_declaracion_jurada
ORDER BY id
GO
