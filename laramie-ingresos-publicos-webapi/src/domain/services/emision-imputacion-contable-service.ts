import EmisionImputacionContable from '../entities/emision-imputacion-contable';
import IEmisionImputacionContableRepository from '../repositories/emision-imputacion-contable-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionImputacionContableService {

	emisionImputacionContableRepository: IEmisionImputacionContableRepository;

	constructor(emisionImputacionContableRepository: IEmisionImputacionContableRepository) {
		this.emisionImputacionContableRepository = emisionImputacionContableRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionImputacionContableRepository.list();
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
				const result = (await this.emisionImputacionContableRepository.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionImputacionContable>).sort((a, b) => a.orden - b.orden);
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
				const result = await this.emisionImputacionContableRepository.findById(id);
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

	async add(emisionImputacionContable: EmisionImputacionContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionImputacionContable.idEmisionDefinicion, true) ||
					!isValidInteger(emisionImputacionContable.idTasa, true) ||
					!isValidInteger(emisionImputacionContable.idSubTasa, true) ||
					!isValidInteger(emisionImputacionContable.idTipoMovimiento, true) ||
					!isValidString(emisionImputacionContable.descripcion, true) ||
					!isValidString(emisionImputacionContable.formulaCondicion, false) ||
					!isValidString(emisionImputacionContable.formulaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.idTasaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.idSubTasaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionImputacionContable.id = null;
				const result = await this.emisionImputacionContableRepository.add(emisionImputacionContable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionImputacionContable: EmisionImputacionContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionImputacionContable.idEmisionDefinicion, true) ||
					!isValidInteger(emisionImputacionContable.idTasa, true) ||
					!isValidInteger(emisionImputacionContable.idSubTasa, true) ||
					!isValidInteger(emisionImputacionContable.idTipoMovimiento, true) ||
					!isValidString(emisionImputacionContable.descripcion, true) ||
					!isValidString(emisionImputacionContable.formulaCondicion, false) ||
					!isValidString(emisionImputacionContable.formulaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.idTasaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.idSubTasaPorcentaje, true) ||
					!isValidInteger(emisionImputacionContable.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionImputacionContableRepository.modify(id, emisionImputacionContable);
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
				const result = await this.emisionImputacionContableRepository.remove(id);
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
				const result = await this.emisionImputacionContableRepository.removeByEmisionDefinicion(idEmisionDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
