import IListaRepository from '../repositories/lista-repository';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class ListaService {

    listaRepository: IListaRepository;

    constructor(listaRepository: IListaRepository) {
        this.listaRepository = listaRepository;
    }

    async list(tipo:string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.listaRepository.list(tipo);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
