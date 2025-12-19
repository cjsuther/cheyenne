import TipoConstruccionFuneraria from '../entities/tipo-construccion-funeraria';
import ITipoConstruccionFunerariaRepository from '../repositories/tipo-construccion-funeraria-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoConstruccionFunerariaService {

	tipoConstruccionFunerariaRepository: ITipoConstruccionFunerariaRepository;

	constructor(tipoConstruccionFunerariaRepository: ITipoConstruccionFunerariaRepository) {
		this.tipoConstruccionFunerariaRepository = tipoConstruccionFunerariaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoConstruccionFunerariaRepository.list();
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
				const result = await this.tipoConstruccionFunerariaRepository.findById(id);
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

	async add(tipoConstruccionFuneraria: TipoConstruccionFuneraria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoConstruccionFuneraria.codigo, true) ||
					!isValidString(tipoConstruccionFuneraria.nombre, true) ||
					!isValidInteger(tipoConstruccionFuneraria.orden, true) ||
					!isValidBoolean(tipoConstruccionFuneraria.conVencimiento) ||
					!isValidInteger(tipoConstruccionFuneraria.plazoMaxConcesion, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoConcesion1, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoConcesion2, true) ||
					!isValidInteger(tipoConstruccionFuneraria.plazoMaxRenovacion, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoRenovacion1, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoRenovacion2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoConstruccionFuneraria.id = null;
				const result = await this.tipoConstruccionFunerariaRepository.add(tipoConstruccionFuneraria);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoConstruccionFuneraria: TipoConstruccionFuneraria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoConstruccionFuneraria.codigo, true) ||
					!isValidString(tipoConstruccionFuneraria.nombre, true) ||
					!isValidInteger(tipoConstruccionFuneraria.orden, true) ||
					!isValidBoolean(tipoConstruccionFuneraria.conVencimiento) ||
					!isValidInteger(tipoConstruccionFuneraria.plazoMaxConcesion, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoConcesion1, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoConcesion2, true) ||
					!isValidInteger(tipoConstruccionFuneraria.plazoMaxRenovacion, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoRenovacion1, true) ||
					!isValidInteger(tipoConstruccionFuneraria.terminoRenovacion2, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoConstruccionFunerariaRepository.modify(id, tipoConstruccionFuneraria);
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
				const result = await this.tipoConstruccionFunerariaRepository.remove(id);
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
