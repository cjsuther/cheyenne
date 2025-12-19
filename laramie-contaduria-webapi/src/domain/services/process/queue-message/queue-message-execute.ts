import QueueMessage from "../../../../infraestructure/sdk/communication/message-router/queue-message";
import ProcessError from "../../../../infraestructure/sdk/error/process-error";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";

export default class QueueMessageExecute {

    constructor() {
        
    }

    async execute(topic:string, message:QueueMessage) {
        return new Promise( async (resolve, reject) => {
            try {

                switch(topic) {
                    case 'AddMovimiento':{
                        const result = await this.executeAddMovimiento(message);
                        resolve({result: result});
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
                    error instanceof ReferenceError) {
                    reject(error);
                }
                else {
                    reject(new ProcessError('Error procesando cola de mensajes', error));
                }
            }
        });
    }

    async executeAddMovimiento(message:QueueMessage) {
        
    }

}