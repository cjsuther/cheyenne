import EmisionCuentaCorriente from '../entities/emision-cuenta-corriente';
import IEmisionCuentaCorrienteRepository from '../repositories/emision-cuenta-corriente-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionCuentaCorrienteService {

	emisionCuentaCorrienteRepository: IEmisionCuentaCorrienteRepository;

	constructor(emisionCuentaCorrienteRepository: IEmisionCuentaCorrienteRepository) {
		this.emisionCuentaCorrienteRepository = emisionCuentaCorrienteRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCuentaCorrienteRepository.list();
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
				const result = (await this.emisionCuentaCorrienteRepository.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionCuentaCorriente>).sort((a, b) => a.orden - b.orden);
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
				const result = await this.emisionCuentaCorrienteRepository.findById(id);
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

	async add(emisionCuentaCorriente: EmisionCuentaCorriente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuentaCorriente.idEmisionDefinicion, true) ||
					!isValidInteger(emisionCuentaCorriente.idTasa, true) ||
					!isValidInteger(emisionCuentaCorriente.idSubTasa, true) ||
					!isValidInteger(emisionCuentaCorriente.idTipoMovimiento, true) ||
					!isValidString(emisionCuentaCorriente.descripcion, true) ||
					!isValidString(emisionCuentaCorriente.formulaCondicion, false) ||
					!isValidString(emisionCuentaCorriente.formulaDebe, true) &&
					!isValidString(emisionCuentaCorriente.formulaHaber, true) ||
					!isValidInteger(emisionCuentaCorriente.vencimiento, true) ||
					!isValidInteger(emisionCuentaCorriente.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionCuentaCorriente.id = null;
				const result = await this.emisionCuentaCorrienteRepository.add(emisionCuentaCorriente);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionCuentaCorriente: EmisionCuentaCorriente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuentaCorriente.idEmisionDefinicion, true) ||
					!isValidInteger(emisionCuentaCorriente.idTasa, true) ||
					!isValidInteger(emisionCuentaCorriente.idSubTasa, true) ||
					!isValidInteger(emisionCuentaCorriente.idTipoMovimiento, true) ||
					!isValidString(emisionCuentaCorriente.descripcion, true) ||
					!isValidString(emisionCuentaCorriente.formulaCondicion, false) ||
					!isValidString(emisionCuentaCorriente.formulaDebe, true) &&
					!isValidString(emisionCuentaCorriente.formulaHaber, true) ||
					!isValidInteger(emisionCuentaCorriente.vencimiento, true) ||
					!isValidInteger(emisionCuentaCorriente.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionCuentaCorrienteRepository.modify(id, emisionCuentaCorriente);
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
				const result = await this.emisionCuentaCorrienteRepository.remove(id);
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
				const result = await this.emisionCuentaCorrienteRepository.removeByEmisionDefinicion(idEmisionDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
