import Acceso from '../entities/acceso';
import IAccesoRepository from '../repositories/acceso-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { DecryptRSA, EncryptPassword } from '../../infraestructure/sdk/utils/cryptograph';

export default class AccesoService {

	accesoRepository: IAccesoRepository;

	constructor(accesoRepository: IAccesoRepository) {
		this.accesoRepository = accesoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.accesoRepository.list();
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
				const result = await this.accesoRepository.findById(id);
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

	async findByIdentificador(identificador: string) {
        return new Promise( async (resolve, reject) => {
            try {
				identificador = identificador.toLowerCase();
                const result = await this.accesoRepository.findByIdentificador(identificador);
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

	async findByLogin(identificador:string, password:string, tipoAcceso: number) {
        return new Promise( async (resolve, reject) => {
            try {
				password = DecryptRSA(password)
				password = EncryptPassword(password);
				identificador = identificador.toLowerCase();
                const result = await this.accesoRepository.findByLogin(identificador, password, tipoAcceso);
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

	async add(acceso: Acceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(acceso.idUsuario, true) ||
					!isValidInteger(acceso.idTipoAcceso, true) ||
					!isValidString(acceso.identificador, true) ||
					!isValidString(acceso.password, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				acceso.identificador = acceso.identificador.toLowerCase();
				acceso.password = EncryptPassword(acceso.password);

				acceso.id = null;
				const result = await this.accesoRepository.add(acceso);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, acceso: Acceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(acceso.idUsuario, true) ||
					!isValidInteger(acceso.idTipoAcceso, true) ||
					!isValidString(acceso.identificador, true) ||
					!isValidString(acceso.password, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				acceso.identificador = acceso.identificador.toLowerCase();
				acceso.password = EncryptPassword(acceso.password);

				const result = await this.accesoRepository.modify(id, acceso);
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
				const result = await this.accesoRepository.remove(id);
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
