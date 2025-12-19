USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,descripcion
      ,id_tipo_tributo
      ,tipo_dato
      ,constante
      ,predefinido
      ,opcional
      ,activo
      ,global
	  ,lista
FROM variable
ORDER BY id_tipo_tributo, codigo
GO
