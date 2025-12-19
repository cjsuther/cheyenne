import ProcessError from '../../infraestructure/sdk/error/process-error';
import SolicitudRequest from '../dto/solicitud-request';
import { isEmpty } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ConsultaRequest from '../dto/consulta-request';
import SolicitudService from './solicitud-service';
import { TRIBUTO_TYPE } from "../../infraestructure/sdk/consts/tributoType";


export default class VolqueteService {

    solicitudService: SolicitudService;

    constructor(solicitudService: SolicitudService) {
        this.solicitudService = solicitudService;
    }

    async add(token: string, idUsuario: number, solicitud: SolicitudRequest) {
        return new Promise( async (resolve, reject) => {
            try {
                const parameters = solicitud.parameters;
                const codigoReciboEspecial = (parameters.tipoSolicitud === "SOLICITUD_VOLQUETE_T1") ? "VOLQUETE_T1" :
                                             (parameters.tipoSolicitud === "SOLICITUD_VOLQUETE_T2") ? "VOLQUETE_T2" : "";
                if (isEmpty(codigoReciboEspecial)) {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }
                parameters.cantidad = 1; // este tipo de solicitud siempre tiene 1 como cantidad, no se pide en el request

                const result = await this.solicitudService.addReciboEspecial(token, idUsuario, solicitud, TRIBUTO_TYPE.COMERCIOS, codigoReciboEspecial, true);

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
                const codigoReciboEspecial = (parameters.tipoSolicitud === "CONSULTA_VOLQUETE_T1") ? "VOLQUETE_T1" :
                                             (parameters.tipoSolicitud === "CONSULTA_VOLQUETE_T2") ? "VOLQUETE_T2" : "";
                if (isEmpty(codigoReciboEspecial)) {
                    reject(new ValidationError('Tipo de solicitud incorrecta'));
                    return;
                }

                const result = this.solicitudService.listByReciboEspecial(token, consulta, TRIBUTO_TYPE.COMERCIOS, codigoReciboEspecial);

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
