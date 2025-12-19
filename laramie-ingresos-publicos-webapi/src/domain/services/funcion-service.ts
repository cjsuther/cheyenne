import Funcion from '../entities/funcion';
import IFuncionRepository from '../repositories/funcion-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class FuncionService {

	funcionRepository: IFuncionRepository;

	constructor(funcionRepository: IFuncionRepository) {
		this.funcionRepository = funcionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.funcionRepository.list() as Array<Funcion>).sort((a, b) => a.codigo.localeCompare(b.codigo));
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
				const result = await this.funcionRepository.findById(id);
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

	async add(funcion: Funcion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(funcion.idCategoriaFuncion, true) ||
					!isValidString(funcion.codigo, true) ||
					!isValidString(funcion.nombre, true) ||
					!isValidString(funcion.descripcion, true) ||
					!isValidString(funcion.tipoDato, true) ||
					!isValidString(funcion.modulo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				funcion.id = null;
				const result = await this.funcionRepository.add(funcion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, funcion: Funcion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(funcion.idCategoriaFuncion, true) ||
					!isValidString(funcion.codigo, true) ||
					!isValidString(funcion.nombre, true) ||
					!isValidString(funcion.descripcion, true) ||
					!isValidString(funcion.tipoDato, true) ||
					!isValidString(funcion.modulo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.funcionRepository.modify(id, funcion);
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
				const result = await this.funcionRepository.remove(id);
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
