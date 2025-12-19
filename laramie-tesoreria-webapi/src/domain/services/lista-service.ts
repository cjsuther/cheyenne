import IListaRepository from '../repositories/lista-repository';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import Lista from '../entities/lista';
import ListaState from '../dto/lista-state';
import { isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';


export default class ListaService {

    listaRepository: IListaRepository;

    constructor(listaRepository: IListaRepository) {
        this.listaRepository = listaRepository;
    }

    async list(tipo:string = "") {
        return new Promise( async (resolve, reject) => {
            try {
                if (tipo.length > 0) {
                    const result = (await this.listaRepository.listTipo(tipo) as Array<Lista>).sort((a, b) => a.orden - b.orden);
                    resolve(result);
                }
                else {
                    const result = (await this.listaRepository.list() as Array<Lista>).sort((a, b) => a.orden - b.orden);
                    resolve(result);
                }
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

    async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.listaRepository.findById(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(lista: Lista) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(lista.tipo, true) ||
					!isValidString(lista.codigo, true) ||
					!isValidString(lista.nombre, true) ||
					!isValidInteger(lista.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				lista.id = null;
				const result = await this.listaRepository.add(lista);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, lista: Lista) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(lista.tipo, true) ||
					!isValidString(lista.codigo, true) ||
					!isValidString(lista.nombre, true) ||
					!isValidInteger(lista.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.listaRepository.modify(id, lista);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.listaRepository.remove(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}
    
}
