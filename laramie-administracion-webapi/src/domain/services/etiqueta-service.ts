import Etiqueta from '../entities/etiqueta';
import IEtiquetaRepository from '../repositories/etiqueta-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EtiquetaService {

	etiquetaRepository: IEtiquetaRepository;

	constructor(etiquetaRepository: IEtiquetaRepository) {
		this.etiquetaRepository = etiquetaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.etiquetaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

    async listByEntidad(entidad:string, idEntidad:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.etiquetaRepository.listByEntidad(entidad, idEntidad);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByPersonaFisica(idPersonaFisica:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.etiquetaRepository.listByPersonaFisica(idPersonaFisica);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async listByPersonaJuridica(idPersonaJuridica:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.etiquetaRepository.listByPersonaJuridica(idPersonaJuridica);
                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.etiquetaRepository.findById(id);
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

	async add(etiqueta: Etiqueta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(etiqueta.entidad, true) ||
					!isValidInteger(etiqueta.idEntidad, true) ||
					!isValidString(etiqueta.codigo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				etiqueta.id = null;
				const result = await this.etiquetaRepository.add(etiqueta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, etiqueta: Etiqueta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(etiqueta.entidad, true) ||
					!isValidInteger(etiqueta.idEntidad, true) ||
					!isValidString(etiqueta.codigo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.etiquetaRepository.modify(id, etiqueta);
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
				const result = await this.etiquetaRepository.remove(id);
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
