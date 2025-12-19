import EmisionVariable from '../entities/emision-variable';
import IEmisionVariableRepository from '../repositories/emision-variable-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionVariableService {

	emisionVariableRepository: IEmisionVariableRepository;

	constructor(emisionVariableRepository: IEmisionVariableRepository) {
		this.emisionVariableRepository = emisionVariableRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionVariableRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionVariableRepository.listByEmisionDefinicion(idEmisionDefinicion);
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
				const result = await this.emisionVariableRepository.findById(id);
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

	async add(emisionVariable: EmisionVariable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionVariable.idEmisionDefinicion, true) ||
					!isValidInteger(emisionVariable.idProcedimientoVariable, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionVariable.id = null;
				const result = await this.emisionVariableRepository.add(emisionVariable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionVariable: EmisionVariable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionVariable.idEmisionDefinicion, true) ||
					!isValidInteger(emisionVariable.idProcedimientoVariable, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionVariableRepository.modify(id, emisionVariable);
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
				const result = await this.emisionVariableRepository.remove(id);
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

	async removeByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionVariableRepository.removeByEmisionDefinicion(idEmisionDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
