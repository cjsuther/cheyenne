import Recaudacion from '../entities/recaudacion';
import IRecaudacionRepository from '../repositories/recaudacion-repository';
import { isValidInteger, isValidString, isValidFloat, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RecaudacionService {

	recaudacionRepository: IRecaudacionRepository;

	constructor(recaudacionRepository: IRecaudacionRepository) {
		this.recaudacionRepository = recaudacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByLote(idRecaudacionLote:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionRepository.listByLote(idRecaudacionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listIngresosPublicos(idsRecaudadora:number[] = []) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionRepository.listIngresosPublicos(idsRecaudadora);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listRegistroContable(idsRecaudadora:number[] = []) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionRepository.listRegistroContable(idsRecaudadora);
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
				const result = await this.recaudacionRepository.findById(id);
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

	async add(recaudacion: Recaudacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(recaudacion.idRecaudacionLote, true) ||
					!isValidInteger(recaudacion.idRecaudadora, true) ||
					!isValidString(recaudacion.numeroControl, false) ||
					!isValidString(recaudacion.numeroComprobante, false) ||
					!isValidString(recaudacion.codigoTipoTributo, false) ||
					!isValidString(recaudacion.numeroCuenta, false) ||
					!isValidString(recaudacion.codigoDelegacion, false) ||
					!isValidInteger(recaudacion.numeroRecibo, false) ||
					!isValidFloat(recaudacion.importeCobro, true) ||
					!isValidDate(recaudacion.fechaCobro, true) ||
					!isValidString(recaudacion.codigoBarras, false) ||
					!isValidDate(recaudacion.fechaConciliacion, false) ||
					!isValidString(recaudacion.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (!isValidInteger(recaudacion.numeroRecibo, false) && !isValidString(recaudacion.codigoBarras, false)
				) {
					reject(new ValidationError('Falta un identificador para el recibo (código de barras o número de recibo)'));
					return;
				}

				recaudacion.id = null;
				if (recaudacion.idReciboPublicacion === 0) recaudacion.idReciboPublicacion = null;
				if (recaudacion.idRegistroContableLote === 0) recaudacion.idRegistroContableLote = null;
				if (recaudacion.idPagoRendicionLote === 0) recaudacion.idPagoRendicionLote = null;
				if (recaudacion.idUsuarioConciliacion === 0) recaudacion.idUsuarioConciliacion = null;
				const result = await this.recaudacionRepository.add(recaudacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, recaudacion: Recaudacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(recaudacion.idRecaudacionLote, true) ||
					!isValidInteger(recaudacion.idRecaudadora, true) ||
					!isValidString(recaudacion.numeroControl, false) ||
					!isValidString(recaudacion.numeroComprobante, false) ||
					!isValidString(recaudacion.codigoTipoTributo, false) ||
					!isValidString(recaudacion.numeroCuenta, false) ||
					!isValidString(recaudacion.codigoDelegacion, false) ||
					!isValidInteger(recaudacion.numeroRecibo, false) ||
					!isValidFloat(recaudacion.importeCobro, true) ||
					!isValidDate(recaudacion.fechaCobro, true) ||
					!isValidString(recaudacion.codigoBarras, false) ||
					!isValidDate(recaudacion.fechaConciliacion, false) ||
					!isValidString(recaudacion.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (!isValidInteger(recaudacion.numeroRecibo, false) && !isValidString(recaudacion.codigoBarras, false)
				) {
					reject(new ValidationError('Falta un identificador para el recibo (código de barras o número de recibo)'));
					return;
				}

				if (recaudacion.idReciboPublicacion === 0) recaudacion.idReciboPublicacion = null;
				if (recaudacion.idRegistroContableLote === 0) recaudacion.idRegistroContableLote = null;
				if (recaudacion.idPagoRendicionLote === 0) recaudacion.idPagoRendicionLote = null;
				if (recaudacion.idUsuarioConciliacion === 0) recaudacion.idUsuarioConciliacion = null;
				const result = await this.recaudacionRepository.modify(id, recaudacion);
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
				const result = await this.recaudacionRepository.remove(id);
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

	async removeByLote(idRecaudacionLote:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionRepository.removeByLote(idRecaudacionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
