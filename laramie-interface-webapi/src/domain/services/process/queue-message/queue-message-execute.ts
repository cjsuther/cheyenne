import QueueMessage from "../../../../infraestructure/sdk/communication/message-router/queue-message";
import ProcessError from "../../../../infraestructure/sdk/error/process-error";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import { Login } from "../../../../infraestructure/sdk/utils/request";
import { clearProfiles } from "../../../../server/authorization/profile";
import SolicitudService from "../../solicitud-service";

export default class QueueMessageExecute {

    solicitudService: SolicitudService;

    constructor(solicitudService: SolicitudService) {
        this.solicitudService = solicitudService;
    }

    async execute(topic: string, message: QueueMessage) {
        return new Promise(async (resolve, reject) => {
            try {

                switch (topic) {
                    case 'AddPagoRecibo': {
                        const result = await this.executeAddPagoRecibo(message);
                        resolve({ result: result });
                        break;
                    }
                    case 'RemovePermiso': {
                        const result = await this.executeRemovePermiso(message);
                        resolve({ result: result });
                        break;
                    }
                    default: {
                        resolve({ result: false, error: 'Mensaje no reconocido' });
                        break;
                    }
                }

            }
            catch (error) {
                if (error instanceof ValidationError ||
                    error instanceof ProcessError ||
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando cola de mensajes', error));
                }
            }
        });
    }

    async executeAddPagoRecibo(message: QueueMessage) {
        const cuentaPago = message.data.cuentaPago;
        const pagoRecibo = message.data.pagoRecibo;

        const token = await Login() as string;
        const result = await this.solicitudService.sendNotificacionPago(token, cuentaPago, pagoRecibo);

        return result;
    }

    async executeRemovePermiso(message: QueueMessage) {
        await clearProfiles();
        return true;
    }

}