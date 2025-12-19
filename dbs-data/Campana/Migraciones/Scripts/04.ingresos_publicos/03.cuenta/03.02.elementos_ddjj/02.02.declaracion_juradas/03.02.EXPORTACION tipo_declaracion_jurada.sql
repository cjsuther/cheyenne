USE LARAMIE_CAMPANA
GO

--tipo_declaracion_jurada
SELECT id
      ,codigo
      ,nombre
      ,orden
      ,id_clase_elemento id_clase_declaracion_jurada
      ,id_unidad_medida
FROM tipo_elemento
ORDER BY id
GO
