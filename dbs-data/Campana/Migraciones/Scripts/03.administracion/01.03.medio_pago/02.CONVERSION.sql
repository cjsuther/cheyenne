USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE medio_pago
GO

INSERT INTO medio_pago
SELECT
    (ROW_NUMBER() OVER (ORDER BY A.numero_cuenta, A.cuitContribuyente)) id,
    CASE
        WHEN per.es_persona_juridica = 0 THEN 500
        WHEN per.es_persona_juridica = 1 THEN 501
        END AS id_tipo_persona,
    per.id id_persona,
    611 id_tipo_medio_pago, --CBU/CVU
    per.nombre+' '+per.apellido titular,
    A.cbu numero,
    '' alias,
    null id_tipo_tarjeta,
    null id_marca_tarjeta,
    null fecha_vencimiento,
    '' cvv,
    eb.id id_entidad_bancaria
FROM
    MAJOR_CAMPANA_COMPLEMENTO.dbo.MonotasaDatosBancarios A
    inner join (select NUMERO_CUENTA, COD_TIPO_PERSONA, ID_PERSONA
                    from MAJOR_CAMPANA.dbo.VINCULO_CUENTA
                    where COD_TIPO_TRIBUTO=2 and ES_CONTRIBUYENTE_PPAL='1'
				) vc on vc.NUMERO_CUENTA=A.numero_cuenta
    inner join LARAMIE_CAMPANA.dbo.persona_unificado per on per.tipo_persona=vc.COD_TIPO_PERSONA and per.numero_documento=vc.ID_PERSONA
    left join LARAMIE_CAMPANA.dbo.lista_administracion eb on eb.tipo='EntidadBancaria' and eb.codigo=A.codigo_banco
ORDER BY id
GO
