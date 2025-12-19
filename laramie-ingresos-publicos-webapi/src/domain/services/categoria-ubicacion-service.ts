import CategoriaUbicacion from '../entities/categoria-ubicacion';
import ICategoriaUbicacionRepository from '../repositories/categoria-ubicacion-repository';
import { isValidString, isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CategoriaUbicacionService {

	categoriaUbicacionRepository: ICategoriaUbicacionRepository;

	constructor(categoriaUbicacionRepository: ICategoriaUbicacionRepository) {
		this.categoriaUbicacionRepository = categoriaUbicacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.categoriaUbicacionRepository.list();
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
				const result = await this.categoriaUbicacionRepository.findById(id);
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

	async add(categoriaUbicacion: CategoriaUbicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaUbicacion.codigo, true) ||
					!isValidString(categoriaUbicacion.nombre, true) ||
					!isValidInteger(categoriaUbicacion.orden, true) ||
					!isValidFloat(categoriaUbicacion.coeficiente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				categoriaUbicacion.id = null;
				const result = await this.categoriaUbicacionRepository.add(categoriaUbicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, categoriaUbicacion: CategoriaUbicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaUbicacion.codigo, true) ||
					!isValidString(categoriaUbicacion.nombre, true) ||
					!isValidInteger(categoriaUbicacion.orden, true) ||
					!isValidFloat(categoriaUbicacion.coeficiente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.categoriaUbicacionRepository.modify(id, categoriaUbicacion);
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
				const result = await this.categoriaUbicacionRepository.remove(id);
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
