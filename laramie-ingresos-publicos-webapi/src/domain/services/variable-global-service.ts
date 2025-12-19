import VariableGlobal from '../entities/variable-global';
import IVariableGlobalRepository from '../repositories/variable-global-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VariableGlobalService {

	variableGlobalRepository: IVariableGlobalRepository;

	constructor(variableGlobalRepository: IVariableGlobalRepository) {
		this.variableGlobalRepository = variableGlobalRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.variableGlobalRepository.list();
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
				const result = await this.variableGlobalRepository.findById(id);
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

	async add(variableGlobal: VariableGlobal) {
		return new Promise( async (resolve, reject) => {
			try {
				console.log(variableGlobal);
				if (
					!isValidInteger(variableGlobal.idVariable, true) ||
					!isValidString(variableGlobal.valor, true) ||
					!isValidDate(variableGlobal.fechaDesde, false) ||
					!isValidDate(variableGlobal.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				variableGlobal.id = null;
				const result = await this.variableGlobalRepository.add(variableGlobal);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, variableGlobal: VariableGlobal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(variableGlobal.idVariable, true) ||
					!isValidString(variableGlobal.valor, true) ||
					!isValidDate(variableGlobal.fechaDesde, false) ||
					!isValidDate(variableGlobal.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.variableGlobalRepository.modify(id, variableGlobal);
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
				const result = await this.variableGlobalRepository.remove(id);
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
