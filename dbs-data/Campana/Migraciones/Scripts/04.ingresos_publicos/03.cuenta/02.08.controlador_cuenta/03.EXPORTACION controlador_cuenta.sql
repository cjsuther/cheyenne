USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_cuenta
      ,id_tipo_controlador
      ,id_controlador
      ,fecha_desde
      ,fecha_hasta
FROM controlador_cuenta
ORDER BY id
GO
