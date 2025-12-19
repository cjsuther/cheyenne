TRUNCATE TABLE configuracion;

INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioCodigo', '6126');
INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioNombre', 'Municipalidad de Campana');
INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioLocalidad', 'Campana');
INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioCuit', '30999284031');
INSERT INTO configuracion(nombre, valor) VALUES ('OrdenamientoGeneral','126'); --DEFINIR
INSERT INTO configuracion(nombre, valor) VALUES ('NomenclaturaCatastral','SSSSSSSSSSSSSSS'); --DEFINIR
INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioPagoFacil','0000');
INSERT INTO configuracion(nombre, valor) VALUES ('MunicipioProvinciaNet','6772');
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo10','340|341|342|343|344'); --DEFINIR
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo11','340|341|342|343|344');
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo12','340|341|342|343|344');
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo13','340|341|342|343|344');
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo14','340|341|342|343|344');
INSERT INTO configuracion(nombre, valor) VALUES ('EmisionProcesosTributo15','340|341|342|343|344');
INSERT INTO configuracion(nombre, valor) VALUES ('DesvioRedondeo','1');
INSERT INTO configuracion(nombre, valor) VALUES ('ReciboComunDiasVencimento','20');

INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialCodigoDebitoAutomatico','1001');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialCodigoBajaProvisoria','1000');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialCodigoAgentesPercepcion','1002');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialPagoProvisorio','1003');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialSolicitudExterna','1004');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialAgenteRetencion','AGENTE_RETENCION');
INSERT INTO configuracion(nombre, valor) VALUES ('TipoCondicionEspecialMonotasa','MONOTASA');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaRecargos','CUENTA_CORRIENTE_TASA_RECARGOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaRecargos','CUENTA_CORRIENTE_SUBTASA_RECARGOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaMultas','CUENTA_CORRIENTE_TASA_MULTAS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaMultas','CUENTA_CORRIENTE_SUBTASA_MULTAS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaHonorarios','CUENTA_CORRIENTE_TASA_HONORARIOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaHonorarios','CUENTA_CORRIENTE_SUBTASA_HONORARIOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaAportes','CUENTA_CORRIENTE_TASA_APORTES');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaAportes','CUENTA_CORRIENTE_SUBTASA_APORTES');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaInteres','CUENTA_CORRIENTE_TASA_INTERES');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaInteres','CUENTA_CORRIENTE_SUBTASA_INTERES');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaMayorA','CUENTA_CORRIENTE_TASA_MAYOR_A');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaMayorA','CUENTA_CORRIENTE_SUBTASA_MAYOR_A');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaMayorC','CUENTA_CORRIENTE_TASA_MAYOR_C');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaMayorC','CUENTA_CORRIENTE_SUBTASA_MAYOR_C');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaMorosidad','CUENTA_CORRIENTE_TASA_MOROSIDAD');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaMorosidad','CUENTA_CORRIENTE_SUBTASA_MOROSIDAD');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaRecargosProteccionCiudadana','CUENTA_CORRIENTE_TASA_RECARGOS_PROTECCION_CIUDADANA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaRecargosProteccionCiudadana','CUENTA_CORRIENTE_SUBTASA_RECARGOS_PROTECCION_CIUDADANA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaSellados','CUENTA_CORRIENTE_TASA_RECARGOS_PROTECCION_CIUDADANA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaSellados','CUENTA_CORRIENTE_SUBTASA_SELLADOS');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaArbaVehiculoMoratoria','CUENTA_CORRIENTE_TASA_ARBA_VEHICULO_MORATORIA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaArbaVehiculoMoratoria','CUENTA_CORRIENTE_SUBTASA_ARBA_VEHICULO_MORATORIA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaArbaVehiculoDeuda','CUENTA_CORRIENTE_TASA_ARBA_VEHICULO_DEUDA');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaArbaVehiculoDeuda','CUENTA_CORRIENTE_SUBTASA_ARBA_VEHICULO_DEUDA');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaCreditoRetencion','CUENTA_CORRIENTE_TASA_CREDITO_RETENCION');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaCreditoRetencion','CUENTA_CORRIENTE_SUBTASA_CREDITO_RETENCION');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaDebitoRetencion','CUENTA_CORRIENTE_TASA_DEBITO_RETENCION');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaDebitoRetencion','CUENTA_CORRIENTE_SUBTASA_DEBITO_RETENCION');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteTasaComercio','CUENTA_CORRIENTE_TASA_COMERCIO');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteSubTasaComercio','CUENTA_CORRIENTE_SUBTASA_COMERCIO');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteInteresRecargos','CUENTA_CORRIENTE_INTERES_RECARGOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCantidadJusHonorarios','CUENTA_CORRIENTE_CANTIDAD_JUS_HONORARIOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrientePorcentajeAportes','CUENTA_CORRIENTE_PORCENTAJE_APORTES');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteImporteSellados','CUENTA_CORRIENTE_IMPORTE_SELLADOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrientePorcentajeGastosCausidicos','CUENTA_CORRIENTE_PORCENTAJE_GASTOS_CAUSIDICOS');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoDelegacionArbaVehiculo','CUENTA_CORRIENTE_CODIGO_DELEGACION_ARBA_VEHICULO');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoDelegacionRecibos','CUENTA_CORRIENTE_CODIGO_DELEGACION_RECIBOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoDelegacionPagoContado','CUENTA_CORRIENTE_CODIGO_DELEGACION_PAGO_CONTADO');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteDiasVencimientoRecibos','CUENTA_CORRIENTE_DIAS_VENCIMIENTO_RECIBOS');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteValorUF','UF');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteValorJus','JUS');

INSERT INTO configuracion(nombre, valor) VALUES ('ComercioTipoModeloDeclaracionJurada','TISH');
INSERT INTO configuracion(nombre, valor) VALUES ('ComercioOrigenDeclaracionJuradaWeb','4');
INSERT INTO configuracion(nombre, valor) VALUES ('ComercioTipoMultaDDJJFueraTermino','1');
INSERT INTO configuracion(nombre, valor) VALUES ('ComercioCantidadUFMultaDDJJFueraTermino','COMERCIO_CANTIDAD_UF_MULTA_DDJJ_FUERA_TERMINO');

INSERT INTO configuracion(nombre, valor) VALUES ('VehiculoCodigoVariableValuacionARBA','VEHICULO_VALUACION_ARBA');

INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoEmision','1');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDescuento','20');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoMultas','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoRecargos','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoRecargosProteccionCiudadana','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoHonorarios','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoAportes','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoMayorA','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoMayorC','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoMorosidad','5');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoPago','2');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoSaldoFavor','4');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDebito','3');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCredito','4');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDebitoReliquidacion','6');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCreditoReliquidacion','7');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDebitoAjuste','8');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCreditoAjuste','9');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDebitoAsignacion','10');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCreditoAsignacion','11');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDebitoRetencion','24');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCreditoRetencion','25');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoPlanPago','13');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoCanceladoConvenio','14');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoBonificadoConvenio','15');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoAccesorioConvenio','16');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoInteres','17');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoDeudaOrigenConvenio','18');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoSellados','12');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoBonificacionPagoContado','22');
INSERT INTO configuracion(nombre, valor) VALUES ('CuentaCorrienteCodigoTipoMovimientoServicioElectrico','19');

INSERT INTO configuracion(nombre, valor) VALUES ('CodigoBanelco','400');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoEmpresa','1048');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoLink','AU9');
INSERT INTO configuracion(nombre, valor) VALUES ('ConceptoLink','001');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoRecaudadoraSucerp','71');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoOrganismoSucerp','00000006');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoRecaudadoraEPagos','99');
INSERT INTO configuracion(nombre, valor) VALUES ('CodigoRecaudadoraInterbanking','88');
