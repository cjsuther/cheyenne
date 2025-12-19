import TipoSuperficie from '../entities/tipo-superficie';
import ITipoSuperficieRepository from '../repositories/tipo-superficie-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoSuperficieService {

	tipoSuperficieRepository: ITipoSuperficieRepository;

	constructor(tipoSuperficieRepository: ITipoSuperficieRepository) {
		this.tipoSuperficieRepository = tipoSuperficieRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoSuperficieRepository.list();
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
				const result = await this.tipoSuperficieRepository.findById(id);
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

	async add(tipoSuperficie: TipoSuperficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoSuperficie.codigo, true) ||
					!isValidString(tipoSuperficie.nombre, true) ||
					!isValidInteger(tipoSuperficie.orden, true) ||
					!isValidInteger(tipoSuperficie.clase, true) ||
					!isValidString(tipoSuperficie.suma, true) ||
					!isValidBoolean(tipoSuperficie.adicionales)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoSuperficie.id = null;
				const result = await this.tipoSuperficieRepository.add(tipoSuperficie);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoSuperficie: TipoSuperficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoSuperficie.codigo, true) ||
					!isValidString(tipoSuperficie.nombre, true) ||
					!isValidInteger(tipoSuperficie.orden, true) ||
					!isValidInteger(tipoSuperficie.clase, true) ||
					!isValidString(tipoSuperficie.suma, true) ||
					!isValidBoolean(tipoSuperficie.adicionales)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoSuperficieRepository.modify(id, tipoSuperficie);
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
				const result = await this.tipoSuperficieRepository.remove(id);
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
