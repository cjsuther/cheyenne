import EmisionProcedimientoParametro from '../entities/emision-procedimiento-parametro';
import IEmisionProcedimientoParametroRepository from '../repositories/emision-procedimiento-parametro-repository';
import { isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionProcedimientoParametroService {

	emisionProcedimientoParametroRepository: IEmisionProcedimientoParametroRepository;

	constructor(emisionProcedimientoParametroRepository: IEmisionProcedimientoParametroRepository) {
		this.emisionProcedimientoParametroRepository = emisionProcedimientoParametroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionProcedimientoParametroRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionProcedimientoParametroRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionProcedimientoParametroRepository.findById(id);
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

	async add(emisionProcedimientoParametro: EmisionProcedimientoParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionProcedimientoParametro.idEmisionEjecucion, true) ||
					!isValidInteger(emisionProcedimientoParametro.idProcedimientoParametro, true) ||
					!isValidString(emisionProcedimientoParametro.valor, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionProcedimientoParametro.id = null;
				const result = await this.emisionProcedimientoParametroRepository.add(emisionProcedimientoParametro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionProcedimientoParametro: EmisionProcedimientoParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionProcedimientoParametro.idEmisionEjecucion, true) ||
					!isValidInteger(emisionProcedimientoParametro.idProcedimientoParametro, true) ||
					!isValidString(emisionProcedimientoParametro.valor, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionProcedimientoParametroRepository.modify(id, emisionProcedimientoParametro);
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
				const result = await this.emisionProcedimientoParametroRepository.remove(id);
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

	async removeByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionProcedimientoParametroRepository.removeByEmisionEjecucion(idEmisionEjecucion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
