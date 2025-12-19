import EmisionCalculoResultado from '../entities/emision-calculo-resultado';
import IEmisionCalculoResultadoRepository from '../repositories/emision-calculo-resultado-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionCalculoResultadoService {

	emisionCalculoResultadoRepository: IEmisionCalculoResultadoRepository;

	constructor(emisionCalculoResultadoRepository: IEmisionCalculoResultadoRepository) {
		this.emisionCalculoResultadoRepository = emisionCalculoResultadoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCalculoResultadoRepository.list();
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
				const result = await this.emisionCalculoResultadoRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionCalculoResultadoRepository.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
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
				const result = await this.emisionCalculoResultadoRepository.findById(id);
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

	async add(emisionCalculoResultado: EmisionCalculoResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCalculoResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionCalculo, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionCalculoResultado.idEstadoEmisionCalculoResultado, true) ||
					!isValidString(emisionCalculoResultado.valor, true) ||
					!isValidString(emisionCalculoResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionCalculoResultado.id = null;
				if (emisionCalculoResultado.idEmisionCuota === 0) emisionCalculoResultado.idEmisionCuota = null;
				const result = await this.emisionCalculoResultadoRepository.add(emisionCalculoResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addBlock(emisionesCalculoResultado: Array<EmisionCalculoResultado>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCalculoResultadoRepository.addBlock(emisionesCalculoResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionCalculoResultado: EmisionCalculoResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCalculoResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionCalculo, true) ||
					!isValidInteger(emisionCalculoResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionCalculoResultado.idEstadoEmisionCalculoResultado, true) ||
					!isValidString(emisionCalculoResultado.valor, true) ||
					!isValidString(emisionCalculoResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (emisionCalculoResultado.idEmisionCuota === 0) emisionCalculoResultado.idEmisionCuota = null;
				const result = await this.emisionCalculoResultadoRepository.modify(id, emisionCalculoResultado);
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
				const result = await this.emisionCalculoResultadoRepository.remove(id);
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
				const result = await this.emisionCalculoResultadoRepository.removeByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionCalculoResultadoRepository.removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
