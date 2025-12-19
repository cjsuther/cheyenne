USE LARAMIE
GO

SET DATEFORMAT  DMY
GO

TRUNCATE TABLE multa
GO

INSERT INTO multa
SELECT
	0 id_cuenta,
	NUMERO_CUENTA,
	1 id_tipo_multa,
	491 id_unidad_valor,
	valor,
	periodo,
	case when mes is null then MONTH(FECHA) else mes end mes,
	ISNULL(FECHA, GETDATE()) fecha,
	t.id id_tasa,
	st.id id_sub_tasa,
	Case
		When Charindex('1900', FECHA_PAGO) <> 0 then NULL
		When DAY(FECHA_PAGO) in (1,2,3,4,5,6,7,8,9) AND MONTH(FECHA_PAGO) in (1,2,3,4,5,6,7,8,9)
			then CONVERT(VARCHAR, '0'+CONVERT(VARCHAR, DAY(FECHA_PAGO))+'0'+CONVERT(VARCHAR,MONTH(FECHA_PAGO))+CONVERT(VARCHAR,YEAR(FECHA_PAGO)))
		When DAY(FECHA_PAGO) in (1,2,3,4,5,6,7,8,9) AND MONTH(FECHA_PAGO) > 9
			then CONVERT(VARCHAR,'0'+CONVERT(VARCHAR, DAY(FECHA_PAGO))+CONVERT(VARCHAR,MONTH(FECHA_PAGO))+CONVERT(VARCHAR,YEAR(FECHA_PAGO)))
		When DAY(FECHA_PAGO) > 9 AND MONTH(FECHA_PAGO) in (1,2,3,4,5,6,7,8,9)
			then CONVERT(VARCHAR, CONVERT(VARCHAR, DAY(FECHA_PAGO))+'0'+CONVERT(VARCHAR,MONTH(FECHA_PAGO))+CONVERT(VARCHAR,YEAR(FECHA_PAGO)))
		Else CONVERT(VARCHAR,DAY(FECHA_PAGO))+CONVERT(VARCHAR,MONTH(FECHA_PAGO))+CONVERT(VARCHAR,YEAR(FECHA_PAGO))
	end id_cuenta_pago
FROM MAJOR.dbo.MULTA_COMERCIO m
	INNER JOIN LARAMIE.dbo.tasa AS t ON t.codigo=m.COD_TASA
	INNER JOIN LARAMIE.dbo.sub_tasa AS st ON st.cod_tasa=m.COD_TASA AND st.codigo=m.COD_SUBTASA
ORDER BY
	NUMERO_CUENTA, fecha
GO

--Actualizo el id_cuenta con los datos reales de cuenta
UPDATE LARAMIE.dbo.multa
SET id_cuenta=c.id
FROM
LARAMIE.dbo.multa e INNER JOIN LARAMIE.dbo.cuenta c ON c.numero_cuenta=e.numero_cuenta WHERE c.id_tipo_tributo=11
GO
