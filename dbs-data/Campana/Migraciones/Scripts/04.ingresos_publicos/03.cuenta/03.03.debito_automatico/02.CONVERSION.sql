USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE debito_automatico
GO

INSERT INTO debito_automatico
SELECT 
	(ROW_NUMBER() OVER (ORDER BY A.numero_cuenta, A.cuitContribuyente)) id,
	isnull(c.id,0) id_cuenta,
	isnull(t.id,0) id_tasa,
	isnull(st.id,0) id_sub_tasa,
	null id_rubro,
	null id_tipo_solicitud_debito_automatico,
	'' numero_solicitud_debito_automatico,
	(ROW_NUMBER() OVER (ORDER BY A.numero_cuenta, A.cuitContribuyente)) id_medio_pago,
	'CBU/CVU - Número: '+A.cbu,
	A.fecha_alta fecha_desde,
	A.fecha_alta fecha_alta,
	null fecha_baja,
	null id_entidad_bancaria
FROM
    MAJOR_CAMPANA_COMPLEMENTO.dbo.MonotasaDatosBancarios A
    inner join (select NUMERO_CUENTA, COD_TIPO_PERSONA, ID_PERSONA
                    from MAJOR_CAMPANA.dbo.VINCULO_CUENTA
                    where COD_TIPO_TRIBUTO=2 and ES_CONTRIBUYENTE_PPAL='1'
				) vc on vc.NUMERO_CUENTA=A.numero_cuenta
    inner join LARAMIE_CAMPANA.dbo.persona_unificado per on per.tipo_persona=vc.COD_TIPO_PERSONA and per.numero_documento=vc.ID_PERSONA
	left join LARAMIE_CAMPANA.dbo.cuenta c on c.id_tipo_tributo=11 and c.numero_cuenta=A.numero_cuenta
	left JOIN LARAMIE.dbo.tasa AS t ON t.codigo='3'
	left JOIN LARAMIE.dbo.sub_tasa AS st ON st.cod_tasa='3' AND st.codigo='1'
ORDER BY
	id
GO

DELETE FROM debito_automatico WHERE id_cuenta=0 OR id_tasa=0 OR id_sub_tasa=0
GO
