import RecursoPorRubro from '../entities/recurso-por-rubro';
import IRecursoPorRubroRepository from '../repositories/recurso-por-rubro-repository';
import { isValidString, isValidInteger, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RecursoPorRubroService {

	recursoPorRubroRepository: IRecursoPorRubroRepository;

	constructor(recursoPorRubroRepository: IRecursoPorRubroRepository) {
		this.recursoPorRubroRepository = recursoPorRubroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recursoPorRubroRepository.list();
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
				const result = await this.recursoPorRubroRepository.findById(id);
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

	async add(recursoPorRubro: RecursoPorRubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recursoPorRubro.codigo, true) ||
					!isValidString(recursoPorRubro.nombre, true) ||
					!isValidInteger(recursoPorRubro.orden, true) ||
					!isValidString(recursoPorRubro.presupuesto, true) ||
					!isValidString(recursoPorRubro.agrupamiento, true) ||
					!isValidString(recursoPorRubro.procedencia, true) ||
					!isValidString(recursoPorRubro.caracterEconomico, true) ||
					!isValidInteger(recursoPorRubro.nivel, true) ||
					!isValidDate(recursoPorRubro.fechaBaja, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				recursoPorRubro.id = null;
				const result = await this.recursoPorRubroRepository.add(recursoPorRubro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, recursoPorRubro: RecursoPorRubro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recursoPorRubro.codigo, true) ||
					!isValidString(recursoPorRubro.nombre, true) ||
					!isValidInteger(recursoPorRubro.orden, true) ||
					!isValidString(recursoPorRubro.presupuesto, true) ||
					!isValidString(recursoPorRubro.agrupamiento, true) ||
					!isValidString(recursoPorRubro.procedencia, true) ||
					!isValidString(recursoPorRubro.caracterEconomico, true) ||
					!isValidInteger(recursoPorRubro.nivel, true) ||
					!isValidDate(recursoPorRubro.fechaBaja, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.recursoPorRubroRepository.modify(id, recursoPorRubro);
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
				const result = await this.recursoPorRubroRepository.remove(id);
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
