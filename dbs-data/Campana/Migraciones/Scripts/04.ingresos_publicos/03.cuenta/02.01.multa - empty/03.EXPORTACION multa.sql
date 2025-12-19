USE LARAMIE
GO

SELECT id
      ,id_cuenta
      ,id_tipo_multa
      ,id_unidad_valor
      ,valor
      ,periodo
      ,mes
      ,fecha
      ,id_tasa
      ,id_sub_tasa
      ,id_cuenta_pago
  FROM LARAMIE.dbo.multa
  ORDER BY
	id
GO
