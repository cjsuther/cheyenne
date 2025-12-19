import MotivoBajaRubroComercio from '../entities/motivo-baja-rubro-comercio';
import IMotivoBajaRubroComercioRepository from '../repositories/motivo-baja-rubro-comercio-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class MotivoBajaRubroComercioService {

	motivoBajaRubroComercioRepository: IMotivoBajaRubroComercioRepository;

	constructor(motivoBajaRubroComercioRepository: IMotivoBajaRubroComercioRepository) {
		this.motivoBajaRubroComercioRepository = motivoBajaRubroComercioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.motivoBajaRubroComercioRepository.list();
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
				const result = await this.motivoBajaRubroComercioRepository.findById(id);
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

	async add(motivoBajaRubroComercio: MotivoBajaRubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(motivoBajaRubroComercio.codigo, true) ||
					!isValidString(motivoBajaRubroComercio.nombre, true) ||
					!isValidInteger(motivoBajaRubroComercio.orden, true) ||
					!isValidBoolean(motivoBajaRubroComercio.bajaConDeuda) ||
					!isValidBoolean(motivoBajaRubroComercio.bajaCancelaDeuda)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				motivoBajaRubroComercio.id = null;
				const result = await this.motivoBajaRubroComercioRepository.add(motivoBajaRubroComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, motivoBajaRubroComercio: MotivoBajaRubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(motivoBajaRubroComercio.codigo, true) ||
					!isValidString(motivoBajaRubroComercio.nombre, true) ||
					!isValidInteger(motivoBajaRubroComercio.orden, true) ||
					!isValidBoolean(motivoBajaRubroComercio.bajaConDeuda) ||
					!isValidBoolean(motivoBajaRubroComercio.bajaCancelaDeuda)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.motivoBajaRubroComercioRepository.modify(id, motivoBajaRubroComercio);
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
				const result = await this.motivoBajaRubroComercioRepository.remove(id);
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
