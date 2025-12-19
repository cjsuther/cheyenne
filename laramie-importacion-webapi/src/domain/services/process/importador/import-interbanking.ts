import moment from 'moment';
import PublishService from '../../publish-service';
import ConfiguracionService from '../../configuracion-service';
import Configuracion from '../../../entities/configuracion';
import ListaService from '../../lista-service';
import CuentaService from '../../cuenta-service';
import CuentaPagoService from '../../cuenta-pago-service';

import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../../../infraestructure/sdk/error/reference-error';
import { getNamespace } from 'cls-hooked';
import { verifyAccessToken } from '../../../../server/authorization/token';
import { castPublicError, getDateNow, getDateToString, precisionRound, truncateTime } from '../../../../infraestructure/sdk/utils/convert';
import RecaudacionLoteDto from '../../../dto/recaudacion-lote-dto';
import Recaudacion from '../../../entities/recaudacion';
import ProcesadorPagoInterbanking from '../../../../infraestructure/sdk/web-services/procesador-pago/procesador-pago-interbanking';
import { PaymentData } from '../../../dto/models/payment-data';
import RecaudacionLote from '../../../entities/recaudacion-lote';
import MicroserviceError from '../../../../infraestructure/sdk/error/microservice-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import Lista from '../../../entities/lista';
import CuentaPago from '../../../entities/cuenta-pago';
import Cuenta from '../../../entities/cuenta';

export default class ImportInterbanking {

    publishService: PublishService;
    configuracionService: ConfiguracionService;
    listaService: ListaService;
    cuentaService: CuentaService;
    cuentaPagoService: CuentaPagoService;
    procesadorPagoInterbanking: ProcesadorPagoInterbanking;

    codigoRecaudadoraEPagos:string;
    codigoRecaudadoraInterbanking:string;

    constructor(publishService: PublishService,
                configuracionService: ConfiguracionService,
                listaService: ListaService,
                cuentaService: CuentaService,
                cuentaPagoService: CuentaPagoService,
                procesadorPagoInterbanking: ProcesadorPagoInterbanking
    ) {
        this.publishService = publishService;
        this.configuracionService = configuracionService;
        this.listaService = listaService;
        this.cuentaService = cuentaService;
        this.cuentaPagoService = cuentaPagoService;
        this.procesadorPagoInterbanking = procesadorPagoInterbanking;
        this.codigoRecaudadoraEPagos = "";
        this.codigoRecaudadoraInterbanking = "";
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

                const configCodigoRecaudadoraInterbanking = await this.configuracionService.findByNombre(token, "CodigoRecaudadoraInterbanking") as Configuracion;
                if (!configCodigoRecaudadoraInterbanking) {
                    throw new ReferenceError('No se pudo obtener los parámetros de configuración INTERBANKING');
                }
                this.codigoRecaudadoraInterbanking = configCodigoRecaudadoraInterbanking.valor;

                const from = fechaEnvio;
                const to = new Date(from);
                to.setDate(to.getDate() + 1);
                const payments = await this.procesadorPagoInterbanking.getPayments(from, to);

                await this.executePago(idUsuario, numeroEnvio, fechaEnvio, payments);

                resolve({ numeroEnvio });
            }
            catch (error) {
				const origen = "laramie-importacion-webapi/services/import-interbanking/import";
                const data = {
                    token: token,
                    idTipoAlerta: 30,
                    idUsuario: idUsuario,
                    fecha: getDateNow(true),
                    idModulo: 30,
                    origen: origen,
                    mensaje: "Error Importación INTERBANKING",
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
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");
                const today = getDateNow(true);
                const tipoTributos = await this.listaService.listByTipo(token, "TipoTributo") as Lista[];

                const lote = new RecaudacionLoteDto();
                lote.codigoRecaudadora = this.codigoRecaudadoraInterbanking;
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

                    let idCuentaPago = 0;
                    let cuentaPago = null;
                    try {
                        idCuentaPago = parseInt(payment.externalId);
                        cuentaPago = await this.cuentaPagoService.findById(token, idCuentaPago) as CuentaPago;
                    }
                    catch (error) {
                        idCuentaPago = 0;
                    }

                    const recaudacion = new Recaudacion();
                    if (idCuentaPago > 0) {
                        const cuenta = await this.cuentaService.findById(token, cuentaPago.idCuenta) as Cuenta;
                        const tipoTributo = tipoTributos.find(f => f.id === cuenta.idTipoTributo);
                        recaudacion.codigoTipoTributo = tipoTributo.codigo;
                        recaudacion.numeroCuenta = cuenta.numeroCuenta;
                        recaudacion.codigoDelegacion = cuentaPago.codigoDelegacion;
                        recaudacion.numeroRecibo = cuentaPago.numeroRecibo;
                        recaudacion.codigoBarras = '';
                        recaudacion.observacion = '';
                    }
                    else {
                        recaudacion.codigoBarras = payment.externalId;
                        recaudacion.observacion = "El id de pago no fue identificado, fue guardado como código de barras";
                    }
                    recaudacion.numeroControl = payment.id.toString();
                    recaudacion.numeroComprobante = '';
                    recaudacion.fechaCobro = truncateTime(payment.createDate);
                    recaudacion.importeCobro = payment.transactionAmount;

                    recaudaciones.push(recaudacion);
                    recaudacionLote.casos++;
                    recaudacionLote.importeTotal += recaudacion.importeCobro;
                }
                recaudacionLote.importeTotal = precisionRound(recaudacionLote.importeTotal);

                if (recaudaciones.length > 0) {
                    await this.publishService.sendMessage("laramie-importacion-webapi/services/import-interbanking/executePago", "AddRecaudacionIngresosPublicos", idUsuario.toString(), lote);
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