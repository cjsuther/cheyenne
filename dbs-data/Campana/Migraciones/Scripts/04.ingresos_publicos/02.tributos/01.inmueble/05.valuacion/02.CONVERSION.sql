USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE valuacion
GO

INSERT INTO valuacion
SELECT 
	(ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id
    ,inm.ID id_inmueble
    ,1040 id_tipo_valuacion
    ,2025 ejercicio
    ,1 mes
    ,A.VALUACION_MUNICIPAL valor
FROM MAJOR_CAMPANA.dbo.INMUEBLE A
	left join LARAMIE_CAMPANA.dbo.inmueble inm on inm.numero_cuenta=A.NUMERO_CUENTA
ORDER BY id
GO
