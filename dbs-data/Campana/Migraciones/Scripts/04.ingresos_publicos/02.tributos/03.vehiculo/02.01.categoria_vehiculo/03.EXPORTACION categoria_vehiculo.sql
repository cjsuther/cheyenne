USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,id_inciso_vehiculo
      ,limite_inferior
      ,limite_superior
	  ,codigo_sucerp
FROM categoria_vehiculo
ORDER BY id
GO
