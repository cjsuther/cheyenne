USE LARAMIE_CAMPANA
GO

--clase_declaracion_jurada
SELECT id
      ,codigo
      ,nombre
      ,orden
      ,0 aplica_rubro
	  ,0 regimen_general
      ,1 obligatorio
	  ,'' observacion
	  ,0 aplica_rubro_principal
	  ,0 aplica_generico
FROM clase_elemento
ORDER BY id
GO
