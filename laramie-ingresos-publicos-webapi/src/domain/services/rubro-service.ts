import Rubro from '../entities/rubro';
import IRubroRepository from '../repositories/rubro-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RubroService {

	rubroRepository: IRubroRepository;

	constructor(rubroRepository: IRubroRepository) {
		this.rubroRepository = rubroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.rubroRepository.list();
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
				const result = await this.rubroRepository.findById(id);
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

	async add(rubro: Rubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubro.codigo, true) ||
					!isValidString(rubro.nombre, true) ||
					!isValidInteger(rubro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				rubro.id = null;
				const result = await this.rubroRepository.add(rubro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, rubro: Rubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubro.codigo, true) ||
					!isValidString(rubro.nombre, true) ||
					!isValidInteger(rubro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.rubroRepository.modify(id, rubro);
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
				const result = await this.rubroRepository.remove(id);
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
