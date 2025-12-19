USE LARAMIE_CAMPANA
GO

SELECT id
      ,entidad
      ,id_entidad
      ,id_tipo_contacto
      ,detalle
  FROM contacto
  ORDER BY id
GO
