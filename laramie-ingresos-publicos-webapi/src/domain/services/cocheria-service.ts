import Cocheria from '../entities/cocheria';
import ICocheriaRepository from '../repositories/cocheria-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CocheriaService {

	cocheriaRepository: ICocheriaRepository;

	constructor(cocheriaRepository: ICocheriaRepository) {
		this.cocheriaRepository = cocheriaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cocheriaRepository.list();
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
				const result = await this.cocheriaRepository.findById(id);
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

	async add(cocheria: Cocheria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(cocheria.codigo, true) ||
					!isValidString(cocheria.nombre, true) ||
					!isValidInteger(cocheria.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cocheria.id = null;
				const result = await this.cocheriaRepository.add(cocheria);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cocheria: Cocheria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(cocheria.codigo, true) ||
					!isValidString(cocheria.nombre, true) ||
					!isValidInteger(cocheria.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cocheriaRepository.modify(id, cocheria);
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
				const result = await this.cocheriaRepository.remove(id);
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
