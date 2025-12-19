import RubroBCRA from '../entities/rubro-bcra';
import IRubroBCRARepository from '../repositories/rubro-bcra-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RubroBCRAService {

	rubroBCRARepository: IRubroBCRARepository;

	constructor(rubroBCRARepository: IRubroBCRARepository) {
		this.rubroBCRARepository = rubroBCRARepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.rubroBCRARepository.list();
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
				const result = await this.rubroBCRARepository.findById(id);
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

	async add(rubroBCRA: RubroBCRA) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroBCRA.codigo, true) ||
					!isValidString(rubroBCRA.nombre, true) ||
					!isValidInteger(rubroBCRA.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				rubroBCRA.id = null;
				const result = await this.rubroBCRARepository.add(rubroBCRA);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, rubroBCRA: RubroBCRA) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroBCRA.codigo, true) ||
					!isValidString(rubroBCRA.nombre, true) ||
					!isValidInteger(rubroBCRA.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.rubroBCRARepository.modify(id, rubroBCRA);
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
				const result = await this.rubroBCRARepository.remove(id);
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
