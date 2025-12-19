import PagoRendicion from '../entities/pago-rendicion';
import IPagoRendicionRepository from '../repositories/pago-rendicion-repository';
import { isValidInteger, isValidString, isValidFloat, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoRendicionService {

	pagoRendicionRepository: IPagoRendicionRepository;

	constructor(pagoRendicionRepository: IPagoRendicionRepository) {
		this.pagoRendicionRepository = pagoRendicionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByLote(idPagoRendicionLote:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionRepository.listByLote(idPagoRendicionLote);
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
				const result = await this.pagoRendicionRepository.findById(id);
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

	async add(pagoRendicion: PagoRendicion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoRendicion.idPagoRendicionLote, true) ||
					!isValidInteger(pagoRendicion.idCuentaPago, true) ||
					!isValidString(pagoRendicion.codigoDelegacion, true) ||
					!isValidInteger(pagoRendicion.numeroRecibo, true) ||
					!isValidString(pagoRendicion.codigoLugarPago, true) ||
					!isValidFloat(pagoRendicion.importePago, true) ||
					!isValidDate(pagoRendicion.fechaPago, true) ||
					!isValidString(pagoRendicion.codigoBarras, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoRendicion.id = null;
				const result = await this.pagoRendicionRepository.add(pagoRendicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoRendicion: PagoRendicion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoRendicion.idPagoRendicionLote, true) ||
					!isValidInteger(pagoRendicion.idCuentaPago, true) ||
					!isValidString(pagoRendicion.codigoDelegacion, true) ||
					!isValidInteger(pagoRendicion.numeroRecibo, true) ||
					!isValidString(pagoRendicion.codigoLugarPago, true) ||
					!isValidFloat(pagoRendicion.importePago, true) ||
					!isValidDate(pagoRendicion.fechaPago, true) ||
					!isValidString(pagoRendicion.codigoBarras, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoRendicionRepository.modify(id, pagoRendicion);
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
				const result = await this.pagoRendicionRepository.remove(id);
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
