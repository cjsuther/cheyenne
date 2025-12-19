import Jurisdiccion from '../entities/jurisdiccion';
import IJurisdiccionRepository from '../repositories/jurisdiccion-repository';
import { isValidString, isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class JurisdiccionService {

	jurisdiccionRepository: IJurisdiccionRepository;

	constructor(jurisdiccionRepository: IJurisdiccionRepository) {
		this.jurisdiccionRepository = jurisdiccionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.jurisdiccionRepository.list();
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
				const result = await this.jurisdiccionRepository.findById(id);
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

	async add(jurisdiccion: Jurisdiccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(jurisdiccion.codigo, true) ||
					!isValidString(jurisdiccion.nombre, true) ||
					!isValidInteger(jurisdiccion.orden, true) ||
					!isValidString(jurisdiccion.ejercicio, true) ||
					!isValidString(jurisdiccion.agrupamiento, true) ||
					!isValidDate(jurisdiccion.fecha, true) ||
					!isValidInteger(jurisdiccion.nivel, true) ||
					!isValidString(jurisdiccion.tipo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				jurisdiccion.id = null;
				const result = await this.jurisdiccionRepository.add(jurisdiccion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, jurisdiccion: Jurisdiccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(jurisdiccion.codigo, true) ||
					!isValidString(jurisdiccion.nombre, true) ||
					!isValidInteger(jurisdiccion.orden, true) ||
					!isValidString(jurisdiccion.ejercicio, true) ||
					!isValidString(jurisdiccion.agrupamiento, true) ||
					!isValidDate(jurisdiccion.fecha, true) ||
					!isValidInteger(jurisdiccion.nivel, true) ||
					!isValidString(jurisdiccion.tipo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.jurisdiccionRepository.modify(id, jurisdiccion);
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
				const result = await this.jurisdiccionRepository.remove(id);
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
