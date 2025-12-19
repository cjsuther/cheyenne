USE LARAMIE
GO

SELECT ROW_NUMBER() OVER (ORDER BY ejercicio, cast(cod_tasa as int), cast(cod_sub_tasa as int)) id
      ,id_tasa
      ,id_sub_tasa
      ,ejercicio
      ,id_tipo_cuota
      ,id_cuenta_contable
      ,id_cuenta_contable_anterior
      ,id_cuenta_contable_futura
      ,id_jurisdiccion_actual
      ,id_recurso_por_rubro_actual
      ,id_jurisdiccion_anterior
      ,id_recurso_por_rubro_anterior
      ,id_jurisdiccion_futura
      ,id_recurso_por_rubro_futura
FROM LARAMIE.dbo.sub_tasa_imputacion
GO
