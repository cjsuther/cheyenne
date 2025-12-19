USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE apremio
GO

INSERT INTO apremio
SELECT
	NUMERO_APREMIO id,	
	NUMERO_APREMIO numero,	
	null id_expediente,
	oju.ID id_organismo_judicial,
	MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_INICIO_DEMANDA) fecha_inicio_demanda,
	(case when isnull(CARPETA,'0')='0' then '' else CARPETA end) carpeta,
	(case when isnull(CARATULA,'0')='0' then '' else CARATULA end) caratula,
	(case when isnull(ESTADO,'0')='0' then '' else ESTADO end) estado,
	EXPEDIENTE detalle_expediente
FROM MAJOR_CAMPANA.dbo.APREMIO A
	left join LARAMIE_CAMPANA.dbo.organo_judicial oju on oju.codigo_organo_judicial=A.COD_ORGANO_JUDICIAL
WHERE NUMERO_APREMIO>0
ORDER BY id
GO
