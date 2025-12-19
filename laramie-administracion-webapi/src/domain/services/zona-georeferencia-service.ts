import ZonaGeoreferencia from '../entities/zona-georeferencia';
import IZonaGeoreferenciaRepository from '../repositories/zona-georeferencia-repository';
import { isValidString, isValidInteger, isValidFloat  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ZonaGeoreferenciaService {

	zonaGeoreferenciaRepository: IZonaGeoreferenciaRepository;

	constructor(zonaGeoreferenciaRepository: IZonaGeoreferenciaRepository) {
		this.zonaGeoreferenciaRepository = zonaGeoreferenciaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.zonaGeoreferenciaRepository.list();
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
				const result = await this.zonaGeoreferenciaRepository.findById(id);
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

	async add(zonaGeoreferencia: ZonaGeoreferencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(zonaGeoreferencia.codigo, true) ||
					!isValidString(zonaGeoreferencia.nombre, true) ||
					!isValidInteger(zonaGeoreferencia.orden, true) ||
					!isValidInteger(zonaGeoreferencia.idLocalidad, true) ||
					!isValidFloat(zonaGeoreferencia.longitud, true) ||
					!isValidFloat(zonaGeoreferencia.latitud, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				zonaGeoreferencia.id = null;
				const result = await this.zonaGeoreferenciaRepository.add(zonaGeoreferencia);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, zonaGeoreferencia: ZonaGeoreferencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(zonaGeoreferencia.codigo, true) ||
					!isValidString(zonaGeoreferencia.nombre, true) ||
					!isValidInteger(zonaGeoreferencia.orden, true) ||
					!isValidInteger(zonaGeoreferencia.idLocalidad, true) ||
					!isValidFloat(zonaGeoreferencia.longitud, true) ||
					!isValidFloat(zonaGeoreferencia.latitud, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.zonaGeoreferenciaRepository.modify(id, zonaGeoreferencia);
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
				const result = await this.zonaGeoreferenciaRepository.remove(id);
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
