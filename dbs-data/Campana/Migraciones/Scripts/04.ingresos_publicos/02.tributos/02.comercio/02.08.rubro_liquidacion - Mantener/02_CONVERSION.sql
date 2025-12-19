USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE rubro_liquidacion
GO

INSERT INTO rubro_liquidacion
SELECT 
	 COD_RUBRO_LIQUIDACION id
    ,COD_RUBRO_LIQUIDACION codigo
    ,NOMBRE
    ,(ROW_NUMBER() OVER (ORDER BY COD_RUBRO_LIQUIDACION)) orden
    ,(case when NUMERA='S' then 1 else 0 end) numera
    ,NUMERO
    ,(case when RELIQUIDA='S' then 1 else 0 end) reliquida

FROM MAJOR_CAMPANA.dbo.RUBRO_LIQUIDACION
WHERE COD_RUBRO_LIQUIDACION>0
ORDER BY id
GO
