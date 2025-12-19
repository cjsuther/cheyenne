USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE rubro_comercio
GO

INSERT INTO rubro_comercio
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA, A.COD_RUBRO)) AS id,
	com.ID AS id_comercio,
	rub.ID AS id_rubro,
	1 AS id_ubicacion_comercio, --1: General
	lic.ID AS id_rubro_liquidacion,
	pro.ID AS id_rubro_provincia,
	ISNULL(bcra.ID, 1) AS id_rubro_bcra,
	rub.nombre AS descripcion,
	CASE WHEN ES_DE_OFICIO = 'S' OR ES_DE_OFICIO = '1' THEN 1 ELSE 0 END AS es_de_oficio,
	CASE WHEN ES_RUBRO_PRINCIPAL = 'S' OR ES_RUBRO_PRINCIPAL = '1' THEN 1 ELSE 0 END AS es_rubro_principal,
	CASE WHEN ES_CON_DDJJ = 'S' OR ES_CON_DDJJ = '1' THEN 1 ELSE 0 END AS es_con_ddjj,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_INICIO) AS fecha_inicio,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_CESE) AS fecha_cese,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_ALTA_TRANSITORIA) AS fecha_alta_transitoria,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA_TRANSITORIA) AS fecha_baja_transitoria,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) AS fecha_baja,
	baja.ID AS id_motivo_baja_rubro_comercio
FROM MAJOR_CAMPANA.dbo.RUBRO_COMERCIO A
	LEFT JOIN LARAMIE_CAMPANA.dbo.comercio com ON com.numero_cuenta = A.NUMERO_CUENTA
	LEFT JOIN LARAMIE_CAMPANA.dbo.rubro rub ON rub.codigo = A.COD_RUBRO
	LEFT JOIN LARAMIE_CAMPANA.dbo.rubro_liquidacion lic ON lic.codigo = A.COD_RUBRO_LIQUIDACION
	LEFT JOIN LARAMIE_CAMPANA.dbo.rubro_provincia pro ON pro.codigo = A.COD_RUBRO_PROVINCIA
	LEFT JOIN LARAMIE_CAMPANA.dbo.rubro_bcra bcra ON bcra.codigo = A.COD_RUBRO_BCRA
	LEFT JOIN LARAMIE_CAMPANA.dbo.motivo_baja_rubro_comercio baja ON baja.codigo = A.COD_MOTIVO_BAJA_COMERCIO
WHERE rub.ID IS NOT NULL AND com.ID IS NOT NULL
ORDER BY id
GO
