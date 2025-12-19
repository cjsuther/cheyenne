import Observacion from '../entities/observacion';
import IObservacionRepository from '../repositories/observacion-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ObservacionService {

	observacionRepository: IObservacionRepository;

	constructor(observacionRepository: IObservacionRepository) {
		this.observacionRepository = observacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.observacionRepository.list();
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
                const result = await this.observacionRepository.listByEntidad(entidad, idEntidad);
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
                const result = await this.observacionRepository.listByPersonaFisica(idPersonaFisica);
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
                const result = await this.observacionRepository.listByPersonaJuridica(idPersonaJuridica);
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
				const result = await this.observacionRepository.findById(id);
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

	async add(idUsuario: number, observacion: Observacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(observacion.entidad, true) ||
					!isValidInteger(observacion.idEntidad, true) ||
					!isValidString(observacion.detalle, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				observacion.idUsuario = idUsuario;
				observacion.fecha = getDateNow(true);
				observacion.id = null;
				const result = await this.observacionRepository.add(observacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, observacion: Observacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(observacion.entidad, true) ||
					!isValidInteger(observacion.idEntidad, true) ||
					!isValidString(observacion.detalle, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.observacionRepository.modify(id, observacion);
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
				const result = await this.observacionRepository.remove(id);
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
