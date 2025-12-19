import QueueMessage from "../../../../infraestructure/sdk/communication/message-router/queue-message";
import ProcessError from "../../../../infraestructure/sdk/error/process-error";
import ReferenceError from "../../../../infraestructure/sdk/error/reference-error";
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import IPersonaRepository from "../../../repositories/persona-repository";
import Persona from "../../../entities/persona";

export default class QueueMessageExecute {

    personaRepository: IPersonaRepository;

    constructor(personaRepository: IPersonaRepository) {
        this.personaRepository = personaRepository;
    }

    async execute(topic:string, message:QueueMessage) {
        return new Promise( async (resolve, reject) => {
            try {

                switch(topic) {
                    case "ModifyPersonaFisica": {
                        const result = await this.executeModifyPersonaFisica(message);
                        resolve({result: result});
                        break;
                    }
                    case "ModifyPersonaJuridica": {
                        const result = await this.executeModifyPersonaJuridica(message);
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

    async executeModifyPersonaFisica(message:QueueMessage) {
        let persona = await this.personaRepository.findById(message.data.id) as Persona;
        if (persona) {
            persona.idTipoDocumento = message.data.idTipoDocumento;
            persona.numeroDocumento = message.data.numeroDocumento;
            persona.nombrePersona = `${message.data.nombre} ${message.data.apellido}`;
            await this.personaRepository.modify(persona.id, persona);                            
        }

        return true;
    }

    async executeModifyPersonaJuridica(message:QueueMessage) {
        let persona = await this.personaRepository.findById(message.data.id) as Persona;
        if (persona) {
            persona.idTipoDocumento = message.data.idTipoDocumento;
            persona.numeroDocumento = message.data.numeroDocumento;
            persona.nombrePersona = message.data.denominacion;
            await this.personaRepository.modify(persona.id, persona);                            
        }

        return true;
    }

}