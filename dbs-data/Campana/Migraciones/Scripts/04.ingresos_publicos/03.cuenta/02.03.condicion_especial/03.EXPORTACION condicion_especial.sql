USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_cuenta
      ,id_tipo_condicion_especial
      ,fecha_desde
      ,fecha_hasta
FROM condicion_especial
ORDER BY id
GO
