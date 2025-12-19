import EmisionConceptoResultado from '../entities/emision-concepto-resultado';
import IEmisionConceptoResultadoRepository from '../repositories/emision-concepto-resultado-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionConceptoResultadoService {

	emisionConceptoResultadoRepository: IEmisionConceptoResultadoRepository;

	constructor(emisionConceptoResultadoRepository: IEmisionConceptoResultadoRepository) {
		this.emisionConceptoResultadoRepository = emisionConceptoResultadoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionConceptoResultadoRepository.list();
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
				const result = await this.emisionConceptoResultadoRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionConceptoResultadoRepository.listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
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
				const result = await this.emisionConceptoResultadoRepository.findById(id);
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

	async add(emisionConceptoResultado: EmisionConceptoResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionConceptoResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionConcepto, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionConceptoResultado.idEstadoEmisionConceptoResultado, true) ||
					!isValidString(emisionConceptoResultado.valorImporteTotal, true) ||
					!isValidString(emisionConceptoResultado.valorImporteNeto, false) ||
					!isValidString(emisionConceptoResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionConceptoResultado.id = null;
				if (emisionConceptoResultado.idEmisionCuota === 0) emisionConceptoResultado.idEmisionCuota = null;
				const result = await this.emisionConceptoResultadoRepository.add(emisionConceptoResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addBlock(emisionesConceptoResultado: Array<EmisionConceptoResultado>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionConceptoResultadoRepository.addBlock(emisionesConceptoResultado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionConceptoResultado: EmisionConceptoResultado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionConceptoResultado.idEmisionEjecucion, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionEjecucionCuenta, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionConcepto, true) ||
					!isValidInteger(emisionConceptoResultado.idEmisionCuota, false) ||
					!isValidInteger(emisionConceptoResultado.idEstadoEmisionConceptoResultado, true) ||
					!isValidString(emisionConceptoResultado.valorImporteTotal, true) ||
					!isValidString(emisionConceptoResultado.valorImporteNeto, false) ||
					!isValidString(emisionConceptoResultado.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (emisionConceptoResultado.idEmisionCuota === 0) emisionConceptoResultado.idEmisionCuota = null;
				const result = await this.emisionConceptoResultadoRepository.modify(id, emisionConceptoResultado);
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
				const result = await this.emisionConceptoResultadoRepository.remove(id);
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
				const result = await this.emisionConceptoResultadoRepository.removeByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.emisionConceptoResultadoRepository.removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
