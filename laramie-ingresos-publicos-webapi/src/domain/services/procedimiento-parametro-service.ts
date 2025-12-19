import ProcedimientoParametro from '../entities/procedimiento-parametro';
import IProcedimientoParametroRepository from '../repositories/procedimiento-parametro-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ProcedimientoParametroService {

	procedimientoParametroRepository: IProcedimientoParametroRepository;

	constructor(procedimientoParametroRepository: IProcedimientoParametroRepository) {
		this.procedimientoParametroRepository = procedimientoParametroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoParametroRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByProcedimiento(idProcedimiento: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.procedimientoParametroRepository.listByProcedimiento(idProcedimiento) as Array<ProcedimientoParametro>).sort((a, b) => a.id - b.id);
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
				const result = await this.procedimientoParametroRepository.findById(id);
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

	async add(procedimientoParametro: ProcedimientoParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoParametro.idProcedimiento, true) ||
					!isValidString(procedimientoParametro.codigo, true) ||
					!isValidString(procedimientoParametro.nombre, true) ||
					!isValidString(procedimientoParametro.tipoDato, true) ||
					!isValidInteger(procedimientoParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				procedimientoParametro.id = null;
				const result = await this.procedimientoParametroRepository.add(procedimientoParametro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, procedimientoParametro: ProcedimientoParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoParametro.idProcedimiento, true) ||
					!isValidString(procedimientoParametro.codigo, true) ||
					!isValidString(procedimientoParametro.nombre, true) ||
					!isValidString(procedimientoParametro.tipoDato, true) ||
					!isValidInteger(procedimientoParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.procedimientoParametroRepository.modify(id, procedimientoParametro);
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
				const result = await this.procedimientoParametroRepository.remove(id);
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

	async removeByProcedimiento(idProcedimiento: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoParametroRepository.removeByProcedimiento(idProcedimiento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
