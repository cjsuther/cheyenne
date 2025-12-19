import moment from 'moment';
import PublishService from '../../publish-service';
import ConfiguracionService from '../../configuracion-service';
import Configuracion from '../../../entities/configuracion';

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../../../infraestructure/sdk/error/reference-error';
import { getNamespace } from 'cls-hooked';
import { verifyAccessToken } from '../../../../server/authorization/token';
import { castPublicError, getDateNow, getDateToString, precisionRound, truncateTime } from '../../../../infraestructure/sdk/utils/convert';
import RecaudacionLoteDto from '../../../dto/recaudacion-lote-dto';
import Recaudacion from '../../../entities/recaudacion';
import ProcesadorPagoEPago from '../../../../infraestructure/sdk/web-services/procesador-pago/procesador-pago-e-pago';
import { PaymentData } from '../../../dto/models/payment-data';
import RecaudacionLote from '../../../entities/recaudacion-lote';
import MicroserviceError from '../../../../infraestructure/sdk/error/microservice-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import CuentaCorrienteItemService from '../../cuenta-corriente-item-service';
import CuentaCorrienteItemDeuda from '../../../dto/cuenta-corriente-item-deuda';
import CuentaCorrienteItemRecibo from '../../../dto/cuenta-corriente-item-recibo';
import CuentaPagoService from '../../cuenta-pago-service';
import CuentaPago from '../../../entities/cuenta-pago';

export default class ImportEPagos {

    publishService: PublishService;
    procesadorPagoEPago: ProcesadorPagoEPago;
    configuracionService: ConfiguracionService;
    cuentaCorrienteItemService: CuentaCorrienteItemService;
    cuentaPagoService: CuentaPagoService;

    codigoRecaudadoraEPagos:string;

    constructor(publishService: PublishService,
                procesadorPagoEPago: ProcesadorPagoEPago,
                configuracionService: ConfiguracionService,
                cuentaCorrienteItemService: CuentaCorrienteItemService,
                cuentaPagoService: CuentaPagoService
    ) {
        this.publishService = publishService;
        this.procesadorPagoEPago = procesadorPagoEPago;
        this.configuracionService = configuracionService;
        this.cuentaCorrienteItemService = cuentaCorrienteItemService;
        this.cuentaPagoService = cuentaPagoService;
        this.codigoRecaudadoraEPagos = "";
    }

    async import(fechaEnvio: Date, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            let token = "";
            const numeroEnvio = this.getDateIdEPagos(fechaEnvio);

            try {
                const localStorage = getNamespace('LocalStorage');
                token = localStorage.get("accessToken");

                try {
                    const dataToken = verifyAccessToken(token);
                    if (dataToken) {
                        idUsuario = dataToken.idUsuario;
                    }
                }
                catch {
                    throw new ReferenceError('Token incorrecto');
                };

                const configCodigoRecaudadoraEPagos = await this.configuracionService.findByNombre(token, "CodigoRecaudadoraEPagos") as Configuracion;
                if (!configCodigoRecaudadoraEPagos) {
                    throw new ReferenceError('No se pudo obtener los parámetros de configuración E-PAGOS');
                }
                this.codigoRecaudadoraEPagos = configCodigoRecaudadoraEPagos.valor;

                const from = fechaEnvio;
                const to = new Date(from);
                to.setDate(to.getDate() + 1);
                const payments = await this.procesadorPagoEPago.getPayments(from, to);

                //busco recibos suats para dar de alta los recibos y actualizo el externalId
                const paymentsSUATS = payments.filter(f => f.data.SUATS);
                for(let i=0; i<paymentsSUATS.length; i++) {
                    const payment = paymentsSUATS[i];
                    const fechaCobro = truncateTime(payment.createDate);
                    const numeroPartida = payment.data.numeroPartida;

                    const cuentaCorrienteItems = await this.cuentaCorrienteItemService.listByPartida(token, numeroPartida) as CuentaCorrienteItemDeuda[];
                    const cuentaCorrienteItem = cuentaCorrienteItems.find(f => f.tasaCabecera);
                    if (!cuentaCorrienteItem) {
                        const data = {
                            token: token,
                            idTipoAlerta: 30,
                            idUsuario: idUsuario,
                            fecha: getDateNow(true),
                            idModulo: 30,
                            origen: "laramie-importacion-webapi/services/import-e-pagos/executePago",
                            mensaje: "Error Importación E-PAGOS (SUATS)",
                            data: {
                                itemImpuesto: payment,
                                message: "No se pudo detectar la deuda"
                            }
                        };

                        await this.publishService.sendMessage("laramie-importacion-webapi/services/import-sucerp/import", "AddAlerta", idUsuario.toString(), data);
                        continue;
                    }
                    const cuentaCorrienteItemRecibo = new CuentaCorrienteItemRecibo();
                    cuentaCorrienteItemRecibo.idCuenta = cuentaCorrienteItem.idCuenta,
                    cuentaCorrienteItemRecibo.idTasa = cuentaCorrienteItem.idTasa,
                    cuentaCorrienteItemRecibo.idSubTasa = cuentaCorrienteItem.idSubTasa,
                    cuentaCorrienteItemRecibo.codigoDelegacion = cuentaCorrienteItem.codigoDelegacion,
                    cuentaCorrienteItemRecibo.numeroMovimiento = cuentaCorrienteItem.numeroMovimiento,
                    cuentaCorrienteItemRecibo.numeroPartida = cuentaCorrienteItem.numeroPartida,
                    cuentaCorrienteItemRecibo.periodo = cuentaCorrienteItem.periodo,
                    cuentaCorrienteItemRecibo.cuota = cuentaCorrienteItem.cuota
                    const result:any = await this.cuentaCorrienteItemService.addReciboComun(token, cuentaCorrienteItem.idCuenta, fechaCobro, cuentaCorrienteItemRecibo, true);
                    const cuentaPago = await this.cuentaPagoService.findById(token, result.idCuentaPago) as CuentaPago;
                    //actualizo el identificadorFactura
                    payment.externalId = cuentaPago.codigoBarras.substring(0,18);
                }

                await this.executePago(idUsuario, numeroEnvio, fechaEnvio, payments);

                resolve({ numeroEnvio });
            }
            catch (error) {
				const origen = "laramie-importacion-webapi/services/import-e-pagos/import";
                const data = {
                    token: token,
                    idTipoAlerta: 30,
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: origen,
                    mensaje: "Error Importación E-PAGOS",
                    data: {
                        numeroEnvio: numeroEnvio,
                        error: castPublicError(error),
                        message: "Error al consultar rendiciones"
                    }
                };
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}

				// resolve({result: false, error: castPublicError(error)});
                reject(error);
            }
        });
    }

    async executePago(idUsuario: number, numeroEnvio:string, fechaEnvio:Date, payments:PaymentData[]) {
        return new Promise(async (resolve, reject) => {
            try {
                const today = getDateNow(true);

                const lote = new RecaudacionLoteDto();
                lote.codigoRecaudadora = this.codigoRecaudadoraEPagos;
                lote.nombre = numeroEnvio;
                lote.path = "";
                const recaudacionLote = lote.recaudacionLote = new RecaudacionLote();
                const recaudaciones = lote.recaudaciones as Recaudacion[];

                recaudacionLote.fechaLote = fechaEnvio;
                recaudacionLote.idUsuarioProceso = idUsuario;
                recaudacionLote.fechaProceso = today;
                recaudacionLote.fechaAcreditacion = null; //no se puede determinar en este lote

                for (let i = 0; i < payments.length; i++) {
                    const payment = payments[i];
                    const recaudacion = new Recaudacion();
                    recaudacion.numeroControl = payment.id.toString();
                    recaudacion.numeroComprobante = '';

                    recaudacion.fechaCobro = truncateTime(payment.createDate);
                    recaudacion.importeCobro = payment.transactionAmount;

                    recaudacion.codigoBarras = payment.externalId;
                    recaudacion.observacion = "";

                    recaudaciones.push(recaudacion);
                    recaudacionLote.casos++;
                    recaudacionLote.importeTotal += recaudacion.importeCobro;
                }
                recaudacionLote.importeTotal = precisionRound(recaudacionLote.importeTotal);

                if (recaudaciones.length > 0) {
                    await this.publishService.sendMessage("laramie-importacion-webapi/services/import-e-pagos/executePago", "AddRecaudacionIngresosPublicos", idUsuario.toString(), lote);
                }
                else {
                    reject(new ValidationError(`No se encontraron rendiciones para la fecha ${getDateToString(fechaEnvio)}`));
                    return;
                }

                resolve({});
            }
            catch (error) {
                if (error instanceof ValidationError ||
                    error instanceof ProcessError ||
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando importación', error));
                }
            }
        });
    }

     private getDateIdEPagos = (date: Date) => {
        return moment(date).format('YYYYMMDD');
    }

}