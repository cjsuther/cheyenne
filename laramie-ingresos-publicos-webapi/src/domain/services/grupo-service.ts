import Grupo from '../entities/grupo';
import IGrupoRepository from '../repositories/grupo-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class GrupoService {

	grupoRepository: IGrupoRepository;

	constructor(grupoRepository: IGrupoRepository) {
		this.grupoRepository = grupoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.grupoRepository.list();
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
				const result = await this.grupoRepository.findById(id);
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

	async add(grupo: Grupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(grupo.codigo, true) ||
					!isValidString(grupo.nombre, true) ||
					!isValidInteger(grupo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				grupo.id = null;
				const result = await this.grupoRepository.add(grupo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, grupo: Grupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(grupo.codigo, true) ||
					!isValidString(grupo.nombre, true) ||
					!isValidInteger(grupo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.grupoRepository.modify(id, grupo);
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
				const result = await this.grupoRepository.remove(id);
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
