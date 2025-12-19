USE LARAMIE_CAMPANA
GO

SELECT id
    ,id_emision_ejecucion
    ,id_emision_cuenta_corriente_resultado
    ,id_cuenta
    ,id_tasa
    ,id_sub_tasa
    ,periodo
    ,cuota
    ,codigo_delegacion
    ,id_tipo_movimiento
    ,importe_debe
    ,importe_haber
    ,fecha_movimiento
    ,fecha_vencimiento1
    ,fecha_vencimiento2
    ,cantidad
    ,id_edesur_cliente
    ,item
    ,id_certificado_apremio
    ,numero_movimiento
    ,id_tipo_valor
    ,id_lugar_pago
    ,fecha_origen
    ,id_usuario_registro
    ,fecha_registro
    ,tasa_cabecera
    ,id_plan_pago
    ,id_plan_pago_cuota
    ,detalle
    ,numero_partida
    ,id_rubro
    ,fecha_vencimiento1_original
    ,fecha_vencimiento2_original
    ,fecha_vencimiento1_prorroga
    ,fecha_vencimiento2_prorroga
    ,id_usuario_proceso
    ,fecha_proceso
    ,fecha_cobro
FROM cuenta_corriente
ORDER BY id
GO