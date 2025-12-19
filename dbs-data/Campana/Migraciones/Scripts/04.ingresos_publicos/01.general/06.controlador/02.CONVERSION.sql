USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE controlador
GO

INSERT INTO controlador
SELECT
	 ID_CONTROLADOR id
	,tco.ID id_tipo_controlador
    ,NUMERO
    ,(case when A.ES_SUPERVISOR='SI' then 1 else 0 end) es_supervisor
	,MAJOR_CAMPANA.dbo.GET_FECHA_DEFAULT(A.FECHA_ALTA, getdate()) fecha_alta
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_BAJA) fecha_baja
	,CATASTRAL_CIR
	,CATASTRAL_SEC
	,CATASTRAL_CODIGO
	,14 catastral_partido
	,CATASTRAL_CHACRA
	,CATASTRAL_LCHACRA
	,CATASTRAL_QUINTA
	,CATASTRAL_LQUINTA
	,CATASTRAL_FRAC
	,CATASTRAL_LFRAC
	,CATASTRAL_MANZ
	,CATASTRAL_LMANZ
	,CATASTRAL_PARC
	,CATASTRAL_LPARC
	,CATASTRAL_SUBPARC
	,CATASTRAL_UFUNC
	,CATASTRAL_UCOMP
    ,per.id id_persona
    ,LEGAJO
    ,110 id_ordenamiento
    ,(case when ID_CONTROLADOR_SUPERVISOR = 0 then NULL else ID_CONTROLADOR_SUPERVISOR end) id_controlador_supervisor
    ,'' clasificacion
    ,NULL fecha_ultima_intimacion
    ,0 cantidad_intimaciones_emitidas
    ,0 cantidad_intimaciones_anuales
    ,0 porcentaje
FROM MAJOR_CAMPANA.dbo.CONTROLADOR A
	left join LARAMIE_CAMPANA.dbo.tipo_controlador tco on tco.codigo=A.COD_TIPO_CONTROLADOR
	left join LARAMIE_CAMPANA.dbo.persona_unificado per on per.tipo_persona=A.COD_TIPO_PERSONA and per.numero_documento=A.ID_PERSONA
WHERE ID_CONTROLADOR>0
ORDER BY ID_CONTROLADOR
GO
