import Provincia from '../entities/provincia';
import IProvinciaRepository from '../repositories/provincia-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ProvinciaService {

	provinciaRepository: IProvinciaRepository;

	constructor(provinciaRepository: IProvinciaRepository) {
		this.provinciaRepository = provinciaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.provinciaRepository.list();
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
				const result = await this.provinciaRepository.findById(id);
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

	async add(provincia: Provincia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(provincia.codigo, true) ||
					!isValidString(provincia.nombre, true) ||
					!isValidInteger(provincia.orden, true) ||
					!isValidInteger(provincia.idPais, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				provincia.id = null;
				const result = await this.provinciaRepository.add(provincia);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, provincia: Provincia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(provincia.codigo, true) ||
					!isValidString(provincia.nombre, true) ||
					!isValidInteger(provincia.orden, true) ||
					!isValidInteger(provincia.idPais, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.provinciaRepository.modify(id, provincia);
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
				const result = await this.provinciaRepository.remove(id);
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
