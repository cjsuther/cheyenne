import ProcessError from '../../infraestructure/sdk/error/process-error';
import SolicitudRequest from '../dto/solicitud-request';
import { isEmpty, isValidDate, isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ConsultaRequest from '../dto/consulta-request';
import SolicitudService from './solicitud-service';
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";
import Cuenta from '../entities/cuenta';
import { Login, SendRequest } from '../../infraestructure/sdk/utils/request';
import { REQUEST_METHOD } from '../../infraestructure/sdk/consts/requestMethodType';
import { APIS } from '../../server/configuration/apis';
import EspecialDTO from '../dto/especial-dto';
import RelacionCuentaState from '../dto/relacion-cuenta-state';
import InmuebleDTO from '../dto/inmueble-dto';
import ObraInmuebleState from '../dto/obra-inmueble-state';
import config from '../../server/configuration/config';
import CuentaPago from '../entities/cuenta-pago';
import { castPublicError, getDateNow } from '../../infraestructure/sdk/utils/convert';
import PublishService from './publish-service';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';


export default class ObraService {

    solicitudService: SolicitudService;
    publishService: PublishService;

    constructor(solicitudService: SolicitudService, publishService: PublishService) {
        this.solicitudService = solicitudService;
        this.publishService = publishService;
    }

    async addObraCarpeta(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = (parameters.tipoSolicitud === "SOLICITUD_OBRA_CARPETA") ? "OBRA_CARPETA" : "";
                if (isEmpty(codigoReciboEspecial)) {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }
                //#region validaciones de parametros
                if (!isValidString(parameters.codigoTipoDocumento, true)) {
                    reject(new ValidationError('Tipo de documento incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroDocumento, true)) {
                    reject(new ValidationError('Número de documento incorrecto'));
                    return;
                }
                if (!isValidString(parameters.periodo, true)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidInteger(parameters.cuota, false)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidDate(parameters.fechaVencimiento, true)) {
                    reject(new ValidationError('Fecha de vencimiento incorrecta'));
                    return;
                }
                //#endregion

                const etiquetas = [
                    `TIPO_SOLICITUD:${parameters.tipoSolicitud}`,
                    `ID_SOLICITUD:${parameters.idSolicitud}`
                ];
                const cuenta = await this.solicitudService.addCuentaEspecialWithPersona(token, parameters.codigoTipoDocumento, parameters.numeroDocumento, etiquetas, parameters.persona) as Cuenta;
                parameters.numeroCuenta = cuenta.numeroCuenta;
                parameters.cantidad = 1; // este tipo de solicitud siempre tiene 1 como cantidad, no se pide en el request

                const result = await this.solicitudService.addReciboEspecial(token, idUsuario, solicitud, TRIBUTO_TYPE.CUENTAS_ESPECIALES, codigoReciboEspecial, false);

                resolve(result);
            }
            catch(error) {
                if (error instanceof ValidationError || error instanceof ProcessError) {
                    reject(error);
                }
                else {
                    if (error.statusCode && error.message) {
                        reject(new ApiError(error.message, error.statusCode));
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            }
        });
    }
    
    async addObraInicio(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = (parameters.tipoSolicitud === "SOLICITUD_OBRA_INICIO") ? "OBRA_INICIO" : "";
                if (isEmpty(codigoReciboEspecial)) {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }
               //#region validaciones de parametros
                if (!isValidString(parameters.codigoTipoDocumento, true)) {
                    reject(new ValidationError('Tipo de documento incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroDocumento, true)) {
                    reject(new ValidationError('Número de documento incorrecto'));
                    return;
                }
                if (!isValidString(parameters.periodo, true)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidInteger(parameters.cuota, false)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidDate(parameters.fechaVencimiento, true)) {
                    reject(new ValidationError('Fecha de vencimiento incorrecta'));
                    return;
                }
                if (!isValidString(parameters.numeroCuentaInmueble, true)) {
                    reject(new ValidationError('Número de cuenta de inmueble incorrecta'));
                    return;
                }
                //#endregion

                try { //se valida la existencia del inmueble
                    await SendRequest(token, `/numero-cuenta/10/${parameters.numeroCuentaInmueble}`, null, REQUEST_METHOD.GET, APIS.URLS.CUENTA);
                }
                catch(error) {
                    reject(new ValidationError('No se pudo validar la Cuenta de inmueble'));
                    return;
                }

                const etiquetas = [
                    `TIPO_SOLICITUD:${parameters.tipoSolicitud}`,
                    `ID_SOLICITUD:${parameters.idSolicitud}`,
                    `CUENTA_INMUEBLE:${solicitud.parameters.numeroCuentaInmueble}`
                ];
                const cuenta = await this.solicitudService.addCuentaEspecialWithPersona(token, parameters.codigoTipoDocumento, parameters.numeroDocumento, etiquetas, parameters.persona) as Cuenta;
                parameters.numeroCuenta = cuenta.numeroCuenta;
                parameters.cantidad = 1; // este tipo de solicitud siempre tiene 1 como cantidad, no se pide en el request

                const result = await this.solicitudService.addReciboEspecial(token, idUsuario, solicitud, TRIBUTO_TYPE.CUENTAS_ESPECIALES, codigoReciboEspecial, false);

                resolve(result);
            }
            catch(error) {
                if (error instanceof ValidationError || error instanceof ProcessError) {
                    reject(error);
                }
                else {
                    if (error.statusCode && error.message) {
                        reject(new ApiError(error.message, error.statusCode));
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            }
        });
    }

}
