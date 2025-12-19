import QueueMessage from "../../../../infraestructure/sdk/communication/message-router/queue-message";
import ProcessError from "../../../../infraestructure/sdk/error/process-error";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import { getDateFromDateId } from "../../../../infraestructure/sdk/utils/convert";
import { sendMail } from "../../../../infraestructure/sdk/utils/mail";
import Mensaje from "../../../entities/mensaje";
import IMensajeRepository from "../../../repositories/mensaje-repository";

export default class QueueMessageExecute {

    mensajeRepository: IMensajeRepository

    constructor(mensajeRepository: IMensajeRepository) {
        this.mensajeRepository = mensajeRepository
    }

    async execute(topic:string, message:QueueMessage) {
        return new Promise( async (resolve, reject) => {
            try {

                switch(topic) {
                    case "AddMensaje": {
                        const result = await this.executeAddMensaje(message)
                        resolve({result: result});
                        break
                    }
                    default: {
                        resolve({result: false, error: 'Mensaje no reconocido'});
                        break
                    }
                }

            }
            catch(error) {
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

    async executeAddMensaje (queueMessage: QueueMessage) {
        const mensaje = await this.mensajeRepository.add(new Mensaje(
            null,
            1,
            10,
            queueMessage.data.idCanal,
            queueMessage.data.idPrioridad,
            queueMessage.data.identificador,
            queueMessage.data.titulo,
            queueMessage.data.cuerpo,
            parseInt(queueMessage.sendUser),
            getDateFromDateId(queueMessage.sendDate),
            new Date(),
            null,
        )) as Mensaje

        let info = await sendMail({
            to: queueMessage.data.identificador,
            subject: queueMessage.data.titulo,
            html: queueMessage.data.cuerpo
        }) as any;

        if (info.result) {
            await this.mensajeRepository.modify(mensaje.id, { ...mensaje, idEstadoMensaje: 11, fechaEnvio: new Date() })
            return true;
        }
        else {
            await this.mensajeRepository.modify(mensaje.id, { ...mensaje, idEstadoMensaje: 12 })
            throw info.data
        }
    }
}