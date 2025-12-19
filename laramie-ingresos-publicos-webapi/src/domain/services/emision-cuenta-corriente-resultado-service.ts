import EmisionCuentaCorrienteResultado from '../entities/emision-cuenta-corriente-resultado';
import IEmisionCuentaCorrienteResultadoRepository from '../repositories/emision-cuenta-corriente-resultado-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionCuentaCorrienteResultadoService {

	emisionCuentaCorrienteResultadoRepository: IEmisionCuentaCorrienteResultadoRepository;

	constructor(emisionCuentaCorrienteResultadoRepository: IEmisionCuentaCorrienteResultadoRepository) {
		this.emisionCuentaCorrienteResultadoRepository = emisionCuentaCorrienteResultadoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCuentaCorrienteResultadoRepository.list();
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.findById(id);
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

	async add(emisionCuentaCorrienteResultado: EmisionCuentaCorrienteResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionCuentaCorriente, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEstadoEmisionCuentaCorrienteResultado, true) ||
					!isValidString(emisionCuentaCorrienteResultado.valorDebe, true) &&
					!isValidString(emisionCuentaCorrienteResultado.valorHaber, true) ||
					!isValidString(emisionCuentaCorrienteResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionCuentaCorrienteResultado.id = null;
				if (emisionCuentaCorrienteResultado.idEmisionCuota === 0) emisionCuentaCorrienteResultado.idEmisionCuota = null;
				const result = await this.emisionCuentaCorrienteResultadoRepository.add(emisionCuentaCorrienteResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addBlock(emisionesCuentaCorrienteResultado: Array<EmisionCuentaCorrienteResultado>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCuentaCorrienteResultadoRepository.addBlock(emisionesCuentaCorrienteResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionCuentaCorrienteResultado: EmisionCuentaCorrienteResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionCuentaCorriente, true) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionCuentaCorrienteResultado.idEstadoEmisionCuentaCorrienteResultado, true) ||
					!isValidString(emisionCuentaCorrienteResultado.valorDebe, true) &&
					!isValidString(emisionCuentaCorrienteResultado.valorHaber, true) ||
					!isValidString(emisionCuentaCorrienteResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (emisionCuentaCorrienteResultado.idEmisionCuota === 0) emisionCuentaCorrienteResultado.idEmisionCuota = null;
				const result = await this.emisionCuentaCorrienteResultadoRepository.modify(id, emisionCuentaCorrienteResultado);
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.remove(id);
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.removeByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionCuentaCorrienteResultadoRepository.removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
