import Dependencia from '../entities/dependencia';
import IDependenciaRepository from '../repositories/dependencia-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class DependenciaService {

	dependenciaRepository: IDependenciaRepository;

	constructor(dependenciaRepository: IDependenciaRepository) {
		this.dependenciaRepository = dependenciaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.dependenciaRepository.list();
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
				const result = await this.dependenciaRepository.findById(id);
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

	async add(dependencia: Dependencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(dependencia.codigo, true) ||
					!isValidString(dependencia.nombre, true) ||
					!isValidInteger(dependencia.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				dependencia.id = null;
				const result = await this.dependenciaRepository.add(dependencia);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, dependencia: Dependencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(dependencia.codigo, true) ||
					!isValidString(dependencia.nombre, true) ||
					!isValidInteger(dependencia.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.dependenciaRepository.modify(id, dependencia);
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
				const result = await this.dependenciaRepository.remove(id);
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
