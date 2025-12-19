import ProcedimientoVariable from '../entities/procedimiento-variable';
import IProcedimientoVariableRepository from '../repositories/procedimiento-variable-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ProcedimientoVariableService {

	procedimientoVariableRepository: IProcedimientoVariableRepository;

	constructor(procedimientoVariableRepository: IProcedimientoVariableRepository) {
		this.procedimientoVariableRepository = procedimientoVariableRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoVariableRepository.list();
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
				const result = (await this.procedimientoVariableRepository.listByProcedimiento(idProcedimiento) as Array<ProcedimientoVariable>).sort((a, b) => a.id - b.id);
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
				const result = await this.procedimientoVariableRepository.findById(id);
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

	async add(procedimientoVariable: ProcedimientoVariable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoVariable.idProcedimiento, true) ||
					!isValidInteger(procedimientoVariable.idColeccionCampo, true) ||
					!isValidInteger(procedimientoVariable.idTipoVariable, true) ||
					!isValidString(procedimientoVariable.codigo, true) ||
					!isValidString(procedimientoVariable.nombre, true) ||
					!isValidString(procedimientoVariable.tipoDato, true) ||
					!isValidInteger(procedimientoVariable.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				procedimientoVariable.id = null;
				const result = await this.procedimientoVariableRepository.add(procedimientoVariable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, procedimientoVariable: ProcedimientoVariable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(procedimientoVariable.idProcedimiento, true) ||
					!isValidInteger(procedimientoVariable.idColeccionCampo, true) ||
					!isValidInteger(procedimientoVariable.idTipoVariable, true) ||
					!isValidString(procedimientoVariable.codigo, true) ||
					!isValidString(procedimientoVariable.nombre, true) ||
					!isValidString(procedimientoVariable.tipoDato, true) ||
					!isValidInteger(procedimientoVariable.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.procedimientoVariableRepository.modify(id, procedimientoVariable);
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
				const result = await this.procedimientoVariableRepository.remove(id);
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
				const result = await this.procedimientoVariableRepository.removeByProcedimiento(idProcedimiento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
