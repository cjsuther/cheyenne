import EmisionImputacionContableResultado from '../entities/emision-imputacion-contable-resultado';
import IEmisionImputacionContableResultadoRepository from '../repositories/emision-imputacion-contable-resultado-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionImputacionContableResultadoService {

	emisionImputacionContableResultadoRepository: IEmisionImputacionContableResultadoRepository;

	constructor(emisionImputacionContableResultadoRepository: IEmisionImputacionContableResultadoRepository) {
		this.emisionImputacionContableResultadoRepository = emisionImputacionContableResultadoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionImputacionContableResultadoRepository.list();
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
				const result = await this.emisionImputacionContableResultadoRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionImputacionContableResultadoRepository.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
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
				const result = await this.emisionImputacionContableResultadoRepository.findById(id);
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

	async add(emisionImputacionContableResultado: EmisionImputacionContableResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionImputacionContableResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionImputacionContable, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionImputacionContableResultado.idEstadoEmisionImputacionContableResultado, true) ||
					!isValidString(emisionImputacionContableResultado.valorPorcentaje, true) ||
					!isValidString(emisionImputacionContableResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionImputacionContableResultado.id = null;
				if (emisionImputacionContableResultado.idEmisionCuota === 0) emisionImputacionContableResultado.idEmisionCuota = null;
				const result = await this.emisionImputacionContableResultadoRepository.add(emisionImputacionContableResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addBlock(emisionesImputacionContableResultado: Array<EmisionImputacionContableResultado>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionImputacionContableResultadoRepository.addBlock(emisionesImputacionContableResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionImputacionContableResultado: EmisionImputacionContableResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionImputacionContableResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionImputacionContable, true) ||
					!isValidInteger(emisionImputacionContableResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionImputacionContableResultado.idEstadoEmisionImputacionContableResultado, true) ||
					!isValidString(emisionImputacionContableResultado.valorPorcentaje, true) ||
					!isValidString(emisionImputacionContableResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (emisionImputacionContableResultado.idEmisionCuota === 0) emisionImputacionContableResultado.idEmisionCuota = null;
				const result = await this.emisionImputacionContableResultadoRepository.modify(id, emisionImputacionContableResultado);
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
				const result = await this.emisionImputacionContableResultadoRepository.remove(id);
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
				const result = await this.emisionImputacionContableResultadoRepository.removeByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionImputacionContableResultadoRepository.removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
