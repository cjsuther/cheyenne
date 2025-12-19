USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE vinculo_cuenta
GO

INSERT INTO vinculo_cuenta
SELECT
	(ROW_NUMBER() OVER (ORDER BY A.COD_TIPO_TRIBUTO,A.NUMERO_CUENTA,A.COD_TIPO_PERSONA,A.ID_PERSONA,A.COD_TIPO_VINCULO)) id
	,cue.id_tipo_tributo
	,cue.id_tributo
	--1: TITULAR - 70: CONTRIBUYENTE - 71: TITULAR EN TRIPARTITO
	,(case
		when cue.id_tipo_tributo=10 and COD_TIPO_VINCULO=1 then 51
		when cue.id_tipo_tributo=10 and COD_TIPO_VINCULO=71 then 52
		when cue.id_tipo_tributo=10 and COD_TIPO_VINCULO=70 then 50
		when cue.id_tipo_tributo=11 and COD_TIPO_VINCULO=1 then 61
		when cue.id_tipo_tributo=11 and COD_TIPO_VINCULO=70 then 60
		when cue.id_tipo_tributo=12 and COD_TIPO_VINCULO=1 then 71
		when cue.id_tipo_tributo=12 and COD_TIPO_VINCULO=70 then 70
		when cue.id_tipo_tributo=13 and COD_TIPO_VINCULO=1 then 81
		when cue.id_tipo_tributo=13 and COD_TIPO_VINCULO=70 then 80
		when cue.id_tipo_tributo=14 and COD_TIPO_VINCULO=1 then 91
		when cue.id_tipo_tributo=14 and COD_TIPO_VINCULO=70 then 90
	  else null end) id_tipo_vinculo
	,per_vin.ID id_persona
	,tins.ID id_tipo_instrumento
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_DESDE) fecha_instrumento_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_HASTA) fecha_instrumento_hasta
	,PORC_CONDOMINIO porcentaje_condominio
	,(case when COD_TIPO_VINCULO in (1,70) then 1 else 0 end) es_contribuyente
	,(case when ES_CONTRIBUYENTE_PPAL='1' then 1 else 0 end) es_contribuyente_principal
FROM MAJOR_CAMPANA.dbo.VINCULO_CUENTA A
	inner join LARAMIE_CAMPANA.dbo.persona_unificado per_vin on per_vin.tipo_persona=A.COD_TIPO_PERSONA and per_vin.numero_documento=A.ID_PERSONA
	left join MAJOR_CAMPANA.dbo.LISTA tri on tri.NOMBRE='TipoTributo' and tri.CODIGO=A.COD_TIPO_TRIBUTO
	left join MAJOR_CAMPANA.dbo.LISTA tins on tins.NOMBRE='TipoInstrumento' and tins.CODIGO=A.COD_TIPO_INSTRUMENTO
	left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=tri.id
WHERE
	A.COD_TIPO_TRIBUTO<>7
ORDER BY id
GO
