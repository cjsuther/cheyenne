import TipoDDJJ from '../entities/tipo-ddjj';
import ITipoDDJJRepository from '../repositories/tipo-ddjj-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoDDJJService {

	tipoDDJJRepository: ITipoDDJJRepository;

	constructor(tipoDDJJRepository: ITipoDDJJRepository) {
		this.tipoDDJJRepository = tipoDDJJRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoDDJJRepository.list();
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
				const result = await this.tipoDDJJRepository.findById(id);
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

	async add(tipoDDJJ: TipoDDJJ) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoDDJJ.codigo, true) ||
					!isValidString(tipoDDJJ.nombre, true) ||
					!isValidInteger(tipoDDJJ.orden, true) ||
					!isValidBoolean(tipoDDJJ.automatico)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoDDJJ.id = null;
				const result = await this.tipoDDJJRepository.add(tipoDDJJ);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoDDJJ: TipoDDJJ) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoDDJJ.codigo, true) ||
					!isValidString(tipoDDJJ.nombre, true) ||
					!isValidInteger(tipoDDJJ.orden, true) ||
					!isValidBoolean(tipoDDJJ.automatico)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoDDJJRepository.modify(id, tipoDDJJ);
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
				const result = await this.tipoDDJJRepository.remove(id);
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
