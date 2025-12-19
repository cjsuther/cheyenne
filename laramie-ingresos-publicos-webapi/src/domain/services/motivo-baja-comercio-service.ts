import MotivoBajaComercio from '../entities/motivo-baja-comercio';
import IMotivoBajaComercioRepository from '../repositories/motivo-baja-comercio-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class MotivoBajaComercioService {

	motivoBajaComercioRepository: IMotivoBajaComercioRepository;

	constructor(motivoBajaComercioRepository: IMotivoBajaComercioRepository) {
		this.motivoBajaComercioRepository = motivoBajaComercioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.motivoBajaComercioRepository.list();
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
				const result = await this.motivoBajaComercioRepository.findById(id);
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

	async add(motivoBajaComercio: MotivoBajaComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(motivoBajaComercio.codigo, true) ||
					!isValidString(motivoBajaComercio.nombre, true) ||
					!isValidInteger(motivoBajaComercio.orden, true) ||
					!isValidBoolean(motivoBajaComercio.bajaConDeuda) ||
					!isValidBoolean(motivoBajaComercio.bajaCancelaDeuda)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				motivoBajaComercio.id = null;
				const result = await this.motivoBajaComercioRepository.add(motivoBajaComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, motivoBajaComercio: MotivoBajaComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(motivoBajaComercio.codigo, true) ||
					!isValidString(motivoBajaComercio.nombre, true) ||
					!isValidInteger(motivoBajaComercio.orden, true) ||
					!isValidBoolean(motivoBajaComercio.bajaConDeuda) ||
					!isValidBoolean(motivoBajaComercio.bajaCancelaDeuda)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.motivoBajaComercioRepository.modify(id, motivoBajaComercio);
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
				const result = await this.motivoBajaComercioRepository.remove(id);
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
