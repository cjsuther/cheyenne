import Pais from '../entities/pais';
import IPaisRepository from '../repositories/pais-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PaisService {

	paisRepository: IPaisRepository;

	constructor(paisRepository: IPaisRepository) {
		this.paisRepository = paisRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.paisRepository.list();
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
				const result = await this.paisRepository.findById(id);
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

	async add(pais: Pais) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(pais.codigo, true) ||
					!isValidString(pais.nombre, true) ||
					!isValidInteger(pais.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pais.id = null;
				const result = await this.paisRepository.add(pais);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pais: Pais) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(pais.codigo, true) ||
					!isValidString(pais.nombre, true) ||
					!isValidInteger(pais.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.paisRepository.modify(id, pais);
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
				const result = await this.paisRepository.remove(id);
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
