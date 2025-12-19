USE LARAMIE_CAMPANA
GO

SELECT id
      ,id_cuenta
      ,id_rubro
      ,id_declaracion_jurada
      ,id_clase_declaracion_jurada
      ,id_tipo_declaracion_jurada
      ,valor
FROM
    dbo.declaracion_jurada_item
ORDER BY
	id
GO
