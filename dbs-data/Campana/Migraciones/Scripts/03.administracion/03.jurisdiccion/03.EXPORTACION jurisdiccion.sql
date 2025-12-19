USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,ejercicio
      ,agrupamiento
      ,fecha_baja
      ,nivel
      ,tipo
      ,ejercicio_oficina
      ,oficina
FROM jurisdiccion
ORDER BY id
GO
