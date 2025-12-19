import TipoAnuncio from '../entities/tipo-anuncio';
import ITipoAnuncioRepository from '../repositories/tipo-anuncio-repository';
import { isValidString, isValidInteger, isValidNumber, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoAnuncioService {

	tipoAnuncioRepository: ITipoAnuncioRepository;

	constructor(tipoAnuncioRepository: ITipoAnuncioRepository) {
		this.tipoAnuncioRepository = tipoAnuncioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoAnuncioRepository.list();
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
				const result = await this.tipoAnuncioRepository.findById(id);
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

	async add(tipoAnuncio: TipoAnuncio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoAnuncio.codigo, true) ||
					!isValidString(tipoAnuncio.nombre, true) ||
					!isValidInteger(tipoAnuncio.orden, true) ||
					!isValidFloat(tipoAnuncio.porcentaje, true) ||
					!isValidFloat(tipoAnuncio.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoAnuncio.id = null;
				const result = await this.tipoAnuncioRepository.add(tipoAnuncio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoAnuncio: TipoAnuncio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoAnuncio.codigo, true) ||
					!isValidString(tipoAnuncio.nombre, true) ||
					!isValidInteger(tipoAnuncio.orden, true) ||
					!isValidFloat(tipoAnuncio.porcentaje, true) ||
					!isValidFloat(tipoAnuncio.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoAnuncioRepository.modify(id, tipoAnuncio);
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
				const result = await this.tipoAnuncioRepository.remove(id);
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
