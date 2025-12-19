import RegistroContable from '../entities/registro-contable';
import IRegistroContableRepository from '../repositories/registro-contable-repository';
import { isValidInteger, isValidDate, isValidString, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RegistroContableService {

	registroContableRepository: IRegistroContableRepository;

	constructor(registroContableRepository: IRegistroContableRepository) {
		this.registroContableRepository = registroContableRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.registroContableRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByLote(idRegistroContableLote:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.registroContableRepository.listByLote(idRegistroContableLote);
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
				const result = await this.registroContableRepository.findById(id);
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

	async add(registroContable: RegistroContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(registroContable.idRegistroContableLote, true) ||
					!isValidInteger(registroContable.idRecaudacion, true) ||
					!isValidDate(registroContable.fechaIngreso, true) ||
					!isValidString(registroContable.cuentaContable, false) ||
					!isValidString(registroContable.jurisdiccion, false) ||
					!isValidString(registroContable.recursoPorRubro, false) ||
					!isValidString(registroContable.codigoLugarPago, true) ||
					!isValidString(registroContable.ejercicio, true) ||
					!isValidString(registroContable.codigoFormaPago, true) ||
					!isValidString(registroContable.codigoTipoRecuadacion, true) ||
					!isValidFloat(registroContable.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				registroContable.id = null;
				const result = await this.registroContableRepository.add(registroContable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, registroContable: RegistroContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(registroContable.idRegistroContableLote, true) ||
					!isValidInteger(registroContable.idRecaudacion, true) ||
					!isValidDate(registroContable.fechaIngreso, true) ||
					!isValidString(registroContable.cuentaContable, false) ||
					!isValidString(registroContable.jurisdiccion, false) ||
					!isValidString(registroContable.recursoPorRubro, false) ||
					!isValidString(registroContable.codigoLugarPago, true) ||
					!isValidString(registroContable.ejercicio, true) ||
					!isValidString(registroContable.codigoFormaPago, true) ||
					!isValidString(registroContable.codigoTipoRecuadacion, true) ||
					!isValidFloat(registroContable.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.registroContableRepository.modify(id, registroContable);
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
				const result = await this.registroContableRepository.remove(id);
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
