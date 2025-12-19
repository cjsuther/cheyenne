import GrupoSuperficie from '../entities/grupo-superficie';
import IGrupoSuperficieRepository from '../repositories/grupo-superficie-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class GrupoSuperficieService {

	grupoSuperficieRepository: IGrupoSuperficieRepository;

	constructor(grupoSuperficieRepository: IGrupoSuperficieRepository) {
		this.grupoSuperficieRepository = grupoSuperficieRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.grupoSuperficieRepository.list();
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
				const result = await this.grupoSuperficieRepository.findById(id);
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

	async add(grupoSuperficie: GrupoSuperficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(grupoSuperficie.codigo, true) ||
					!isValidString(grupoSuperficie.nombre, true) ||
					!isValidInteger(grupoSuperficie.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				grupoSuperficie.id = null;
				const result = await this.grupoSuperficieRepository.add(grupoSuperficie);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, grupoSuperficie: GrupoSuperficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(grupoSuperficie.codigo, true) ||
					!isValidString(grupoSuperficie.nombre, true) ||
					!isValidInteger(grupoSuperficie.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.grupoSuperficieRepository.modify(id, grupoSuperficie);
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
				const result = await this.grupoSuperficieRepository.remove(id);
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
