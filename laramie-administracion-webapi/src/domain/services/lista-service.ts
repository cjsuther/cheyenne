import IListaRepository from '../repositories/lista-repository';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import Lista from '../entities/lista';
import ListaState from '../dto/lista-state';


export default class ListaService {

    listaRepository: IListaRepository;

    constructor(listaRepository: IListaRepository) {
        this.listaRepository = listaRepository;
    }

    async list(tipo:string) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.listaRepository.list(tipo) as Array<Lista>).sort((a, b) => a.orden - b.orden);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async listRubroAfipByPersonaJuridica(idPersonaJuridica:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = (await this.listaRepository.listRubroAfipByPersonaJuridica(idPersonaJuridica) as Array<ListaState>).sort((a, b) => a.orden - b.orden);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
