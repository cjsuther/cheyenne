USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_lado_terreno
      ,id_tasa
      ,id_sub_tasa
      ,fecha_desde
      ,fecha_hasta
FROM lado_terreno_servicio
ORDER BY id
GO
