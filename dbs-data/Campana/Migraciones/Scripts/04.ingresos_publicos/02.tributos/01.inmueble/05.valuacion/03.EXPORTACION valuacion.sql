USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_inmueble
      ,id_tipo_valuacion
      ,ejercicio
      ,mes
      ,valor
FROM valuacion
ORDER BY id
GO
