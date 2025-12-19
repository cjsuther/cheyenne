USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE cuenta_contable
GO

INSERT INTO cuenta_contable
SELECT
    (ROW_NUMBER() OVER (ORDER BY EJERCICIO, COD_CUENTA_CONTABLE)) id
     ,COD_CUENTA_CONTABLE codigo
     ,NOMBRE nombre
     ,ROW_NUMBER() OVER (ORDER BY EJERCICIO, COD_CUENTA_CONTABLE) orden
     ,AGRUPAMIENTO agrupamiento
     ,EJERCICIO ejercicio
     ,TIPO tipo
     ,EJERCICIO_AGRUPAMIENTO ejercicio_agrupamiento
     ,PORCENTAJE_AFECTADA porcentaje_afectada
     ,(case when CON_CHEQUE_RETENCION='S' then 1 else 0 end) con_cheque_retencion
     ,MAJOR_CAMPANA.dbo.GET_FECHA(FECHA_BAJA) fecha_baja
FROM MAJOR_CAMPANA.dbo.cuenta_contable
WHERE COD_CUENTA_CONTABLE > 0
ORDER BY EJERCICIO, COD_CUENTA_CONTABLE
GO
