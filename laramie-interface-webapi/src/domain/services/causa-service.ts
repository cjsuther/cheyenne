import ProcessError from '../../infraestructure/sdk/error/process-error';
import SolicitudRequest from '../dto/solicitud-request';
import { isEmpty, isValidArray, isValidDate, isValidFloat, isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ConsultaRequest from '../dto/consulta-request';
import SolicitudService from './solicitud-service';
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";
import Cuenta from '../entities/cuenta';


export default class CausaService {

    solicitudService: SolicitudService;

    constructor(solicitudService: SolicitudService) {
        this.solicitudService = solicitudService;
    }

    async add(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                if (["SOLICITUD_CAUSA_ALTA"].includes(parameters.tipoSolicitud)) {
                    this.addAlta(token, idUsuario, solicitud)
                    .then(resolve).catch(reject);
                }
                else if (["SOLICITUD_CAUSA_AJUSTE"].includes(parameters.tipoSolicitud)) {
                    this.addAjuste(token, idUsuario, solicitud)
                    .then(resolve).catch(reject);
                }
                else if (["SOLICITUD_CAUSA_VEP"].includes(parameters.tipoSolicitud)) {
                    this.addVep(token, idUsuario, solicitud)
                    .then(resolve).catch(reject);
                }
                else if (["SOLICITUD_CAUSA_PLAN_PAGO"].includes(parameters.tipoSolicitud)) {
                    this.addPlanPago(token, idUsuario, solicitud)
                    .then(resolve).catch(reject);
                }
                else {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }
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

    private async addAlta(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = `INFRACCION_${parameters.codigoInfraccion}`;

                //#region validaciones de parametros
                if (!isValidString(parameters.codigoInfraccion, true)) {
                    reject(new ValidationError('Código de infracción incorrecto'));
                    return;
                }
                if (!isValidString(parameters.periodo, true)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroCausa, false)) {
                    reject(new ValidationError('Número causa incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroActa, false)) {
                    reject(new ValidationError('Número acta incorrecto'));
                    return;
                }
                if (!isValidString(parameters.dominio, false)) {
                    reject(new ValidationError('Dominio incorrecto'));
                    return;
                }
                if (!isValidDate(parameters.fechaVencimiento, true)) {
                    reject(new ValidationError('Fecha de vencimiento incorrecta'));
                    return;
                }
                //#endregion

                if (isEmpty(parameters.numeroCuenta)) {
                    const cuenta = await this.solicitudService.verifyCuentaEspecialByCausa(token,
                        parameters.periodo,
                        parameters.numeroCausa,
                        parameters.numeroActa,
                        parameters.dominio,
                        parameters.observacion,
                        parameters.persona
                    ) as Cuenta;
                    parameters.numeroCuenta = cuenta.numeroCuenta;
                }

                const result = await this.solicitudService.addByCausa(token, idUsuario, solicitud, TRIBUTO_TYPE.CUENTAS_ESPECIALES, codigoReciboEspecial);

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

    private async addAjuste(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = `INFRACCION_${parameters.codigoInfraccion}`;

                //#region validaciones de parametros
                if (!isValidString(parameters.periodo, true)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroCausa, false)) {
                    reject(new ValidationError('Número causa incorrecto'));
                    return;
                }
                if (!isValidFloat(parameters.importe, false)) {
                    reject(new ValidationError('Importe incorrecto'));
                    return;
                }
                if (!isValidDate(parameters.fechaVencimiento, true)) {
                    reject(new ValidationError('Fecha de vencimiento incorrecta'));
                    return;
                }
                //#endregion

                if (isEmpty(parameters.numeroCuenta)) {
                    const cuenta = await this.solicitudService.verifyCuentaEspecialByCausa(token,
                        parameters.periodo,
                        parameters.numeroCausa,
                        parameters.numeroActa,
                        parameters.dominio,
                        parameters.observacion,
                        parameters.persona
                    ) as Cuenta;
                    parameters.numeroCuenta = cuenta.numeroCuenta;
                }

                const result = await this.solicitudService.addAjusteByCausa(token, idUsuario, solicitud, TRIBUTO_TYPE.CUENTAS_ESPECIALES, codigoReciboEspecial);

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
    
    private async addVep(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;

                //#region validaciones de parametros
                if (!isValidString(parameters.periodo, true)) {
                    reject(new ValidationError('Periodo incorrecto'));
                    return;
                }
                if (!isValidString(parameters.numeroCausa, false)) {
                    reject(new ValidationError('Número causa incorrecto'));
                    return;
                }
                if (!isValidArray(parameters.items, true)) {
                    reject(new ValidationError('Falta ingresar items'));
                    return;
                }
                //#endregion

                if (isEmpty(parameters.numeroCuenta)) {
                    const cuenta = await this.solicitudService.verifyCuentaEspecialByCausa(token,
                        parameters.periodo,
                        parameters.numeroCausa
                    ) as Cuenta;
                    parameters.numeroCuenta = cuenta.numeroCuenta;
                }

                const result = await this.solicitudService.createVep(token, idUsuario, solicitud, TRIBUTO_TYPE.CUENTAS_ESPECIALES);

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

    private async addPlanPago(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;

                if (isEmpty(parameters.numeroCuenta)) {
                    const cuenta = await this.solicitudService.verifyCuentaEspecialByCausa(token,
                        parameters.periodo,
                        parameters.numeroCausa
                    ) as Cuenta;
                    parameters.numeroCuenta = cuenta.numeroCuenta;
                }

                const result = await this.solicitudService.createPlanPagoCuentaEspecial(token, idUsuario, solicitud);

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

    async list(token: string, consulta: ConsultaRequest) {
		return new Promise( async (resolve, reject) => {
			try {
                const parameters = consulta.parameters;
                if (!["CONSULTA_CAUSA"].includes(parameters.tipoSolicitud)) {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }

                if (!isEmpty(parameters.periodo) && !isEmpty(parameters.numeroCausa)) {
                    const cuenta = await this.solicitudService.verifyCuentaEspecialByCausa(token,
                        parameters.periodo,
                        parameters.numeroCausa
                    ) as Cuenta;
                    parameters.numeroCuenta = cuenta.numeroCuenta;
                }

                const result = this.solicitudService.listByCausa(token, consulta);

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
