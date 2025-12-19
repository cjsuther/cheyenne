USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_variable
      ,id_cuenta
      ,valor
      ,fecha_desde
      ,fecha_hasta
  FROM variable_cuenta
  ORDER BY id
GO
