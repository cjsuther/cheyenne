USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE cuenta_corriente
GO

INSERT INTO cuenta_corriente
SELECT
	(ROW_NUMBER() OVER (ORDER BY CC.COD_TIPO_TRIBUTO,CC.NUMERO_CUENTA,CC.NUMERO_PARTIDA,CC.COD_RUBRO,CC.COD_TASA,CC.COD_SUBTASA,CC.COD_TIPO_MOVIMIENTO,CC.NUMERO_ITEM,CC.NUMERO_MOVIMIENTO,CC.COD_LUGAR_PAGO)) id
	, NULL id_emision_ejecucion
	, NULL id_emision_cuenta_corriente_resultado
	, cta.id id_cuenta
	, t.id id_tasa
	, st.id id_sub_tasa
	, CC.PERIODO periodo
	, CC.CUOTA cuota
	, CC.CODIGO_DELEGACION codigo_delegacion
	, tm.id id_tipo_movimiento
	, CC.IMPORTE_DEBE importe_debe
	, CC.IMPORTE_HABER importe_haber
	, CC.FECHA_PROCESO fecha_movimiento
	, CC.FECHA_VENCIMIENTO1 fecha_vencimiento1
	, CC.FECHA_VENCIMIENTO2 fecha_vencimiento2
	, 0 cantidad
	, NULL id_edesur_cliente
	, CC.NUMERO_ITEM item
	, NULL id_certificado_apremio
	, CC.NUMERO_MOVIMIENTO numero_movimiento
	, 320 id_tipo_valor -- 320 es el tipo de valor "Pesos"
	, NULL id_lugar_pago
	, CC.FECHA_PROCESO fecha_origen
	, 1 id_usuario_registro -- Usuario creado para migrations
	, CC.FECHA_PROCESO fecha_registro
	, (case when CC.TASA_CABECERA='SI' then 1 else 0 end) tasa_cabecera
	, NULL id_plan_pago
	, NULL id_plan_pago_cuota
	, CC.DETALLE detalle
	, CC.NUMERO_PARTIDA numero_partida
	, (case when CC.COD_TIPO_TRIBUTO='2' then ru.id else NULL end) id_rubro -- COD_TIPO_TRIBUTO 2 es COMERCIO
	, CC.FECHA_VENCIMIENTO1 fecha_vencimiento1_original
	, CC.FECHA_VENCIMIENTO2 fecha_vencimiento2_original
	, NULL fecha_vencimiento1_prorroga
	, NULL fecha_vencimiento2_prorroga
	, NULL id_usuario_proceso
	, CC.FECHA_PROCESO fecha_proceso
	, CC.FECHA_COBRO fecha_cobro
FROM MAJOR_CAMPANA.dbo.CUENTA_CORRIENTE CC
	left join MAJOR_CAMPANA.dbo.LISTA L on L.NOMBRE='TipoTributo' and L.CODIGO=CC.COD_TIPO_TRIBUTO
	left join LARAMIE_CAMPANA.dbo.cuenta cta on cta.numero_cuenta=CC.NUMERO_CUENTA and cta.id_tipo_tributo=L.id
	left join LARAMIE_CAMPANA.dbo.tasa t on t.codigo=CC.COD_TASA
	left join LARAMIE_CAMPANA.dbo.sub_tasa st on st.codigo=cc.COD_SUBTASA and st.id_tasa=t.id
	left join LARAMIE_CAMPANA.dbo.rubro ru on ru.codigo=CC.COD_RUBRO
	left join LARAMIE_CAMPANA.dbo.tipo_movimiento tm on tm.codigo=CC.COD_TIPO_MOVIMIENTO
WHERE cta.id IS NOT NULL AND st.id IS NOT NULL
ORDER BY CC.COD_TIPO_TRIBUTO,CC.NUMERO_CUENTA,CC.NUMERO_PARTIDA,CC.COD_RUBRO,CC.COD_TASA,CC.COD_SUBTASA,CC.COD_TIPO_MOVIMIENTO,CC.NUMERO_ITEM,CC.NUMERO_MOVIMIENTO,CC.COD_LUGAR_PAGO
GO