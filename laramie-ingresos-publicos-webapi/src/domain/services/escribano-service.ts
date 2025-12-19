import Escribano from '../entities/escribano';
import IEscribanoRepository from '../repositories/escribano-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EscribanoService {

	escribanoRepository: IEscribanoRepository;

	constructor(escribanoRepository: IEscribanoRepository) {
		this.escribanoRepository = escribanoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.escribanoRepository.list();
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
				const result = await this.escribanoRepository.findById(id);
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

	async add(escribano: Escribano) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(escribano.codigo, true) ||
					!isValidString(escribano.nombre, true) ||
					!isValidInteger(escribano.orden, true) ||
					!isValidString(escribano.matricula, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				escribano.id = null;
				const result = await this.escribanoRepository.add(escribano);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, escribano: Escribano) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(escribano.codigo, true) ||
					!isValidString(escribano.nombre, true) ||
					!isValidInteger(escribano.orden, true) ||
					!isValidString(escribano.matricula, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.escribanoRepository.modify(id, escribano);
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
				const result = await this.escribanoRepository.remove(id);
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
