USE LARAMIE_CAMPANA
GO

SELECT id
      ,codigo
      ,nombre
      ,orden
      ,presupuesto
      ,agrupamiento
      ,procedencia
      ,caracter_economico
      ,nivel
      ,fecha_baja
      ,detalle
      ,ejercicio
FROM recurso_por_rubro
ORDER BY id
GO
