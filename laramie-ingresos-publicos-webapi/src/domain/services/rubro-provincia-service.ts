import RubroProvincia from '../entities/rubro-provincia';
import IRubroProvinciaRepository from '../repositories/rubro-provincia-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RubroProvinciaService {

	rubroProvinciaRepository: IRubroProvinciaRepository;

	constructor(rubroProvinciaRepository: IRubroProvinciaRepository) {
		this.rubroProvinciaRepository = rubroProvinciaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.rubroProvinciaRepository.list();
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
				const result = await this.rubroProvinciaRepository.findById(id);
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

	async add(rubroProvincia: RubroProvincia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroProvincia.codigo, true) ||
					!isValidString(rubroProvincia.nombre, true) ||
					!isValidInteger(rubroProvincia.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				rubroProvincia.id = null;
				const result = await this.rubroProvinciaRepository.add(rubroProvincia);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, rubroProvincia: RubroProvincia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(rubroProvincia.codigo, true) ||
					!isValidString(rubroProvincia.nombre, true) ||
					!isValidInteger(rubroProvincia.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.rubroProvinciaRepository.modify(id, rubroProvincia);
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
				const result = await this.rubroProvinciaRepository.remove(id);
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
