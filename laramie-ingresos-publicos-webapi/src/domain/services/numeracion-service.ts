import Numeracion from '../entities/numeracion';
import INumeracionRepository from '../repositories/numeracion-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class NumeracionService {

	numeracionRepository: INumeracionRepository;

	constructor(numeracionRepository: INumeracionRepository) {
		this.numeracionRepository = numeracionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.numeracionRepository.list();
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
				const result = await this.numeracionRepository.findById(id);
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

	async findByNombre(nombre:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.numeracionRepository.findByNombre(nombre);
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

	async findByProximo(nombre:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.numeracionRepository.findByProximo(nombre);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(numeracion: Numeracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeracion.nombre, true) ||
					!isValidInteger(numeracion.valorProximo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				numeracion.id = null;
				const result = await this.numeracionRepository.add(numeracion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, numeracion: Numeracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeracion.nombre, true) ||
					!isValidInteger(numeracion.valorProximo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.numeracionRepository.modify(id, numeracion);
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

	async modifyByNombre(nombre: string, numeracion: Numeracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (!isValidInteger(numeracion.valorProximo, true)) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.numeracionRepository.modifyByNombre(nombre, numeracion);
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
				const result = await this.numeracionRepository.remove(id);
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
