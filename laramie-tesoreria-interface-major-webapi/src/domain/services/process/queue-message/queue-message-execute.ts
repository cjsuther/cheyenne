import QueueMessage from "../../../../infraestructure/sdk/communication/message-router/queue-message";
import ReciboPublicacionLoteService from "../../recibo-publicacion-lote-service";
import ReciboPublicacionLote from "../../../entities/recibo-publicacion-lote";
import PagoRendicionLoteService from "../../pago-rendicion-lote-service";
import ReciboPublicacionService from "../../recibo-publicacion-service";
import PublishService from "../../publish-service";
import ProcessError from "../../../../infraestructure/sdk/error/process-error";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import MicroserviceError from "../../../../infraestructure/sdk/error/microservice-error";
import { castPublicError, getDateNow } from "../../../../infraestructure/sdk/utils/convert";
import { clearProfiles } from "../../../../server/authorization/profile";

export default class QueueMessageExecute {

    publishService: PublishService;
    reciboPublicacionService: ReciboPublicacionService;
    reciboPublicacionLoteService: ReciboPublicacionLoteService;
    pagoRendicionLoteService: PagoRendicionLoteService;

    constructor(publishService: PublishService,
                reciboPublicacionService: ReciboPublicacionService,
                reciboPublicacionLoteService: ReciboPublicacionLoteService,
                pagoRendicionLoteService: PagoRendicionLoteService
    ) {
        this.publishService = publishService;
        this.reciboPublicacionService = reciboPublicacionService;
        this.reciboPublicacionLoteService = reciboPublicacionLoteService;
        this.pagoRendicionLoteService = pagoRendicionLoteService;
    }

    async execute(topic:string, message:QueueMessage) {
        return new Promise( async (resolve, reject) => {
            try {

                switch(topic) {
                    case 'AddReciboPublicacion':{
                        const result = await this.executeAddReciboPublicacion(message);
                        resolve({result: result});
                        break;
                    }
                    case 'ConfirmacionPagoRendicion':{
                        const result = await this.executeConfirmacionPagoRendicion(message);
                        resolve({result: result});
                        break;
                    }
                    case 'RemovePermiso': {
                        const result = await this.executeRemovePermiso(message);
                        resolve({ result: result });
                        break;
                    }
                    default: {
                        resolve({result: false, error: 'Mensaje no reconocido'});
                        break;
                    }
                }

            }
            catch(error) {
                if (error instanceof ValidationError ||
                    error instanceof ProcessError ||
                    error instanceof MicroserviceError ||
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando cola de mensajes', error));
                }
            }
        });
    }

    async executeAddReciboPublicacion(message:QueueMessage) {
        try {
            let reciboPublicacionLote = new ReciboPublicacionLote();
            reciboPublicacionLote.setFromObject(message.data);

            reciboPublicacionLote = await this.reciboPublicacionLoteService.add(reciboPublicacionLote) as ReciboPublicacionLote;
            if (!reciboPublicacionLote.masivo) {
                await this.reciboPublicacionService.modifyExportByLote("queue", 0, reciboPublicacionLote.numeroLotePublicacion);
            }

            return true;
        }
        catch (error) {
            const origen = "laramie-tesoreria-interface-major-webapi/queue-message-execute/executeAddReciboPublicacion";
            const data = {
                token: "queue",
                idTipoAlerta: 32, //Cuenta Corriente
                idUsuario: 0,
                fecha: getDateNow(true),
                idModulo: 30,
                origen: origen,
                mensaje: "Error Publicación Recibo - Registro de Lote",
                data: {
                    lote: message.data,
                    error: castPublicError(error)
                }
            };
            try {
                await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
            }
            catch (error) {
                throw new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data);
            }

            return false;
        }
    }

    async executeConfirmacionPagoRendicion(message:QueueMessage) {
        try {
            const numeroLoteRendicion = message.data.numeroLoteRendicion;
            const fechaConfirmacion = new Date(message.data.fechaConfirmacion);
            const observacionConfirmacion = message.data.observacionConfirmacion;
    
            await this.pagoRendicionLoteService.modifyConfirmacion(numeroLoteRendicion, fechaConfirmacion, observacionConfirmacion);
    
            return true;
        }
        catch (error) {
            try {
                const numeroLoteRendicion = message.data.numeroLoteRendicion;
                await this.pagoRendicionLoteService.modifyError(numeroLoteRendicion, "Error en executeConfirmacionPagoRendicion");
            }
            catch {}

            const origen = "laramie-tesoreria-interface-major-webapi/queue-message-execute/executeConfirmacionPagoRendicion";
            const data = {
                token: "queue",
                idTipoAlerta: 32, //Cuenta Corriente
                idUsuario: 0,
                fecha: getDateNow(true),
                idModulo: 30,
                origen: origen,
                mensaje: "Error Rendición Pago - Confirmación de Lote",
                data: {
                    lote: message.data,
                    error: castPublicError(error)
                }
            };
            try {
                await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
            }
            catch (error) {
                throw new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data);
            }

            return false;
        }
    }

    async executeRemovePermiso(message: QueueMessage) {
        await clearProfiles();
        return true;
    }

}