import EmisionCuota from '../entities/emision-cuota';
import IEmisionCuotaRepository from '../repositories/emision-cuota-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionCuotaService {

	emisionCuotaRepository: IEmisionCuotaRepository;

	constructor(emisionCuotaRepository: IEmisionCuotaRepository) {
		this.emisionCuotaRepository = emisionCuotaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCuotaRepository.list();
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
				const result = (await this.emisionCuotaRepository.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionCuota>).sort((a, b) => a.orden - b.orden);
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
				const result = await this.emisionCuotaRepository.findById(id);
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

	async add(emisionCuota: EmisionCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuota.idEmisionEjecucion, true) ||
					!isValidString(emisionCuota.cuota, true) ||
					!isValidInteger(emisionCuota.mes, true) ||
					!isValidString(emisionCuota.descripcion, true) ||
					!isValidString(emisionCuota.formulaCondicion, false) ||
					!isValidString(emisionCuota.anioDDJJ, false) ||
					!isValidInteger(emisionCuota.mesDDJJ, false) ||
					!isValidDate(emisionCuota.fechaVencimiento1, true) ||
					!isValidDate(emisionCuota.fechaVencimiento2, true) ||
					!isValidInteger(emisionCuota.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionCuota.id = null;
				const result = await this.emisionCuotaRepository.add(emisionCuota);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionCuota: EmisionCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuota.idEmisionEjecucion, true) ||
					!isValidString(emisionCuota.cuota, true) ||
					!isValidInteger(emisionCuota.mes, true) ||
					!isValidString(emisionCuota.descripcion, true) ||
					!isValidString(emisionCuota.formulaCondicion, false) ||
					!isValidString(emisionCuota.anioDDJJ, false) ||
					!isValidInteger(emisionCuota.mesDDJJ, false) ||
					!isValidDate(emisionCuota.fechaVencimiento1, true) ||
					!isValidDate(emisionCuota.fechaVencimiento2, true) ||
					!isValidInteger(emisionCuota.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionCuotaRepository.modify(id, emisionCuota);
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
				const result = await this.emisionCuotaRepository.remove(id);
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
				const result = await this.emisionCuotaRepository.removeByEmisionEjecucion(idEmisionEjecucion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
