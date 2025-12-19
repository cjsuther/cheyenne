import EmisionEjecucionCuota from '../entities/emision-ejecucion-cuota';
import IEmisionEjecucionCuotaRepository from '../repositories/emision-ejecucion-cuota-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionEjecucionCuotaService {

	emisionEjecucionCuotaRepository: IEmisionEjecucionCuotaRepository;

	constructor(emisionEjecucionCuotaRepository: IEmisionEjecucionCuotaRepository) {
		this.emisionEjecucionCuotaRepository = emisionEjecucionCuotaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucion(idEmisionEjecucion: number, includeData: boolean = false) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.listByEmisionEjecucion(idEmisionEjecucion, includeData);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
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
				const result = await this.emisionEjecucionCuotaRepository.findById(id);
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

	async add(emisionEjecucionCuota: EmisionEjecucionCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionEjecucionCuota.idEmisionEjecucion, true) ||
					!isValidInteger(emisionEjecucionCuota.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionEjecucionCuota.idEmisionCuota, true) ||
					!isValidInteger(emisionEjecucionCuota.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionEjecucionCuota.id = null;
				if (emisionEjecucionCuota.idPlanPagoCuota === 0) emisionEjecucionCuota.idPlanPagoCuota = null;
				const result = await this.emisionEjecucionCuotaRepository.add(emisionEjecucionCuota);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByBloque(emisionEjecucionCuotas: Array<EmisionEjecucionCuota>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.addByBloque(emisionEjecucionCuotas);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionEjecucionCuota: EmisionEjecucionCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionEjecucionCuota.idEmisionEjecucion, true) ||
					!isValidInteger(emisionEjecucionCuota.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionEjecucionCuota.idEmisionCuota, true) ||
					!isValidInteger(emisionEjecucionCuota.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (emisionEjecucionCuota.idPlanPagoCuota === 0) emisionEjecucionCuota.idPlanPagoCuota = null;
				const result = await this.emisionEjecucionCuotaRepository.modify(id, emisionEjecucionCuota);
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

	async modifyByEmisionEjecucion(updates:Array<any>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.modifyByEmisionEjecucion(updates);
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
				const result = await this.emisionEjecucionCuotaRepository.remove(id);
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
				const result = await this.emisionEjecucionCuotaRepository.removeByEmisionEjecucion(idEmisionEjecucion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionCuotaRepository.removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
