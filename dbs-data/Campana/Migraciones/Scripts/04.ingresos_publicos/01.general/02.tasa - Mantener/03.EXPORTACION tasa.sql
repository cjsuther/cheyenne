USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,id_tipo_tributo
      ,id_categoria_tasa
      ,descripcion
      ,porcentaje_descuento
FROM tasa
ORDER BY id
GO
