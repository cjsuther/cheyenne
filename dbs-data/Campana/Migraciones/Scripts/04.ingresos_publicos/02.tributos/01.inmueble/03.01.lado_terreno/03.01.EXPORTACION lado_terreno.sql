USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_inmueble
      ,id_tipo_lado
      ,numero
      ,metros
      ,reduccion
FROM lado_terreno
ORDER BY id
GO
