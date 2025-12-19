import CategoriaTasa from '../entities/categoria-tasa';
import ICategoriaTasaRepository from '../repositories/categoria-tasa-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CategoriaTasaService {

	categoriaTasaRepository: ICategoriaTasaRepository;

	constructor(categoriaTasaRepository: ICategoriaTasaRepository) {
		this.categoriaTasaRepository = categoriaTasaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.categoriaTasaRepository.list();
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
				const result = await this.categoriaTasaRepository.findById(id);
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

	async add(categoriaTasa: CategoriaTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaTasa.codigo, true) ||
					!isValidString(categoriaTasa.nombre, true) ||
					!isValidInteger(categoriaTasa.orden, true) ||
					!isValidBoolean(categoriaTasa.esPlan) ||
					!isValidBoolean(categoriaTasa.esDerechoEspontaneo)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				categoriaTasa.id = null;
				const result = await this.categoriaTasaRepository.add(categoriaTasa);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, categoriaTasa: CategoriaTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaTasa.codigo, true) ||
					!isValidString(categoriaTasa.nombre, true) ||
					!isValidInteger(categoriaTasa.orden, true) ||
					!isValidBoolean(categoriaTasa.esPlan) ||
					!isValidBoolean(categoriaTasa.esDerechoEspontaneo)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.categoriaTasaRepository.modify(id, categoriaTasa);
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
				const result = await this.categoriaTasaRepository.remove(id);
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
