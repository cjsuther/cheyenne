import ProcessError from '../../infraestructure/sdk/error/process-error';
import SolicitudRequest from '../dto/solicitud-request';
import { isEmpty, isValidDate, isValidInteger, isValidNumber, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ConsultaRequest from '../dto/consulta-request';
import SolicitudService from './solicitud-service';
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";
import Cuenta from '../entities/cuenta';


export default class LicenciaService {

    solicitudService: SolicitudService;

    constructor(solicitudService: SolicitudService) {
        this.solicitudService = solicitudService;
    }

    async add(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = (parameters.tipoSolicitud === "SOLICITUD_LICENCIA_ORIGINAL") ? "LICENCIA_ORIGINAL" :
                                             (parameters.tipoSolicitud === "SOLICITUD_LICENCIA_DUPLICADO") ? "LICENCIA_DUPLICADO" :
                                             (parameters.tipoSolicitud === "SOLICITUD_LICENCIA_RENOVACION") ? "LICENCIA_RENOVACION" : "";
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

}
