USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE persona_unificado
GO

INSERT INTO persona_unificado
SELECT
	(ROW_NUMBER() OVER (ORDER BY P.COD_TIPO_PERSONA,P.ID_PERSONA)) id,
	P.COD_TIPO_PERSONA tipo_persona,
	P.COD_TIPO_DOCUMENTO id_tipo_documento,
	P.ID_PERSONA numero_documento,
	nac.id id_nacionalidad,
	ltrim(rtrim(REPLACE(ISNULL(P.NOMBRE,''),'NULL',''))) nombre,
    ltrim(rtrim(REPLACE(ISNULL(P.APELLIDO,''),'NULL',''))) apellido,
	gen.ID id_genero,
	civ.ID id_estado_civil,
	est.ID id_nivel_estudio,
    P.PROFESION,
	P.MATRICULA,
	MAJOR_CAMPANA.dbo.GET_FECHA(P.FECHA_NACIMIENTO) fecha_nacimiento,
	MAJOR_CAMPANA.dbo.GET_FECHA(P.FECHA_DEFUNCION) fecha_defuncion,
	Case When P.DISCAPACIDAD = 'S' then 1 else 0 end discapacidad,
	fis.ID id_condicion_fiscal,
	iibb.ID id_ingresos_brutos,
	Case When P.GANANCIAS = 'S' then 1 else 0 end ganancias,
	'' pin,
	'' foto,
	'' denominacion,
	'' nombre_fantasia,
	null id_forma_juridica,
	null id_juridiccion,
	null fecha_constitucion,
	12 mes_cierre,
	'' logo,
	MAJOR_CAMPANA.dbo.GET_DOMICILIO(P.CALLE,P.ALTURA,P.PISO,P.DEPTO,P.CP,
		case when L.IdLocalidad is null then 0 else L.IdLocalidad end,
		case when R.IdProvincia is null then 0 else R.IdProvincia end,
		case when R.IdProvincia is null then 0 else 1 end
	) domicilio
FROM
	MAJOR_CAMPANA.dbo.PERSONA P

	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R ON TRIM(R.Descripcion)=TRIM(P.PROVINCIA)
	LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado L ON TRIM(L.Descripcion)=TRIM(P.LOCALIDAD) and L.IdProvincia=R.IdProvincia and P.LOCALIDAD<>''

	left join LARAMIE_CAMPANA.dbo.pais nac on nac.codigo=P.COD_PAIS_NACIONALIDAD
	left join MAJOR_CAMPANA.dbo.LISTA gen on gen.NOMBRE='Genero' and gen.CODIGO=p.COD_GENERO
	left join MAJOR_CAMPANA.dbo.LISTA civ on civ.NOMBRE='EstadoCivil' and civ.CODIGO=p.COD_ESTADO_CIVIL
	left join MAJOR_CAMPANA.dbo.LISTA est on est.NOMBRE='NivelEstudio' and est.CODIGO=p.COD_NIVEL_ESTUDIO
	left join MAJOR_CAMPANA.dbo.LISTA fis on est.NOMBRE='CondicionFiscal' and fis.CODIGO=p.COD_CONDICION_FISCAL
	left join MAJOR_CAMPANA.dbo.LISTA iibb on est.NOMBRE='IngresosBrutos' and iibb.CODIGO=p.COD_INGRESOS_BRUTOS
ORDER BY
	P.COD_TIPO_PERSONA,
	P.ID_PERSONA
GO

DELETE FROM persona_unificado WHERE len(replace(numero_documento,'0',''))=0
GO
