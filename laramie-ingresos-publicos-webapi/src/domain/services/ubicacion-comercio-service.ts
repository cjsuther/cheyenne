import UbicacionComercio from '../entities/ubicacion-comercio';
import IUbicacionComercioRepository from '../repositories/ubicacion-comercio-repository';
import { isValidString, isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class UbicacionComercioService {

	ubicacionComercioRepository: IUbicacionComercioRepository;

	constructor(ubicacionComercioRepository: IUbicacionComercioRepository) {
		this.ubicacionComercioRepository = ubicacionComercioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.ubicacionComercioRepository.list();
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
				const result = await this.ubicacionComercioRepository.findById(id);
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

	async add(ubicacionComercio: UbicacionComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(ubicacionComercio.codigo, true) ||
					!isValidString(ubicacionComercio.nombre, true) ||
					!isValidInteger(ubicacionComercio.orden, true) ||
					!isValidFloat(ubicacionComercio.coeficiente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				ubicacionComercio.id = null;
				const result = await this.ubicacionComercioRepository.add(ubicacionComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, ubicacionComercio: UbicacionComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(ubicacionComercio.codigo, true) ||
					!isValidString(ubicacionComercio.nombre, true) ||
					!isValidInteger(ubicacionComercio.orden, true) ||
					!isValidFloat(ubicacionComercio.coeficiente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.ubicacionComercioRepository.modify(id, ubicacionComercio);
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
				const result = await this.ubicacionComercioRepository.remove(id);
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
