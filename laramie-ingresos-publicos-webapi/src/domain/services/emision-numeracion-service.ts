import EmisionNumeracion from '../entities/emision-numeracion';
import IEmisionNumeracionRepository from '../repositories/emision-numeracion-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionNumeracionService {

	emisionNumeracionRepository: IEmisionNumeracionRepository;

	constructor(emisionNumeracionRepository: IEmisionNumeracionRepository) {
		this.emisionNumeracionRepository = emisionNumeracionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionNumeracionRepository.list();
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
				const result = await this.emisionNumeracionRepository.findById(id);
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

	async add(emisionNumeracion: EmisionNumeracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(emisionNumeracion.nombre, true) ||
					!isValidInteger(emisionNumeracion.valorProximo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionNumeracion.id = null;
				const result = await this.emisionNumeracionRepository.add(emisionNumeracion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionNumeracion: EmisionNumeracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(emisionNumeracion.nombre, true) ||
					!isValidInteger(emisionNumeracion.valorProximo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionNumeracionRepository.modify(id, emisionNumeracion);
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
				const result = await this.emisionNumeracionRepository.remove(id);
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
