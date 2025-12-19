import Valuacion from '../entities/valuacion';
import ValuacionState from '../dto/valuacion-state';
import IValuacionRepository from '../repositories/valuacion-repository';
import { isValidFloat, isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ValuacionService {

	valuacionRepository: IValuacionRepository;

	constructor(valuacionRepository: IValuacionRepository) {
		this.valuacionRepository = valuacionRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.valuacionRepository.listByInmueble(idInmueble) as Array<ValuacionState>).sort((a, b) => a.id - b.id);
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
				const result = await this.valuacionRepository.findById(id);
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

	async add(valuacion: Valuacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(valuacion.idInmueble, true) ||
					!isValidInteger(valuacion.idTipoValuacion, true) ||
					!isValidString(valuacion.ejercicio, true) ||
					!isValidInteger(valuacion.mes, true) ||
					!isValidFloat(valuacion.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				valuacion.id = null;
				const result = await this.valuacionRepository.add(valuacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, valuacion: Valuacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(valuacion.idInmueble, true) ||
					!isValidInteger(valuacion.idTipoValuacion, true) ||
					!isValidString(valuacion.ejercicio, true) ||
					!isValidInteger(valuacion.mes, true) ||
					!isValidFloat(valuacion.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.valuacionRepository.modify(id, valuacion);
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
				const result = await this.valuacionRepository.remove(id);
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

	async removeByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.valuacionRepository.removeByInmueble(idInmueble);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
