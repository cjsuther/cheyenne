import ProcessError from '../../infraestructure/sdk/error/process-error';
import ValidationError from '../../infraestructure/sdk/error/validation-error';


export default class ListaService {

    constructor() {
    }

    async list(tipo:string) {
        return new Promise( async (resolve, reject) => {
            try {
                // const result = await this.listaRepository.list(tipo);
                // resolve(result);
                reject(new ValidationError('Funcionalidad no implementada'));
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
