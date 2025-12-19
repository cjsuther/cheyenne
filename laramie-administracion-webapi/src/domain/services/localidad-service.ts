import Localidad from '../entities/localidad';
import ILocalidadRepository from '../repositories/localidad-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class LocalidadService {

	localidadRepository: ILocalidadRepository;

	constructor(localidadRepository: ILocalidadRepository) {
		this.localidadRepository = localidadRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.localidadRepository.list();
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
				const result = await this.localidadRepository.findById(id);
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

	async add(localidad: Localidad) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(localidad.codigo, true) ||
					!isValidString(localidad.nombre, true) ||
					!isValidInteger(localidad.orden, true) ||
					!isValidInteger(localidad.idProvincia, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				localidad.id = null;
				const result = await this.localidadRepository.add(localidad);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, localidad: Localidad) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(localidad.codigo, true) ||
					!isValidString(localidad.nombre, true) ||
					!isValidInteger(localidad.orden, true) ||
					!isValidInteger(localidad.idProvincia, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.localidadRepository.modify(id, localidad);
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
				const result = await this.localidadRepository.remove(id);
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
