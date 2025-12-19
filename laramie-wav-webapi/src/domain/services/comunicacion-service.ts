import Mensaje from '../entities/mensaje';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import PublishService from './publish-service';
import ApiError from '../../infraestructure/sdk/error/api-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ComunicacionService {

    publishService: PublishService;

    constructor(publishService: PublishService) {
        this.publishService = publishService;
    }

    async addEMail(token: string, titulo: string, cuerpo: string, identificador: string, idUsuario: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const mensaje = new Mensaje(20, 30, identificador, titulo, cuerpo);

                const result = await this.publishService.sendMessage(
                    "laramie-wav-webapi/comunicacion-service/addEMail",
                    "AddMensaje",
                    idUsuario.toString(),
                    mensaje
                ) as any;

                resolve(result.id);
            }
            catch(error) {
                reject(new ProcessError('Error procesando e-mail', error));
            }
        });
    }

}
