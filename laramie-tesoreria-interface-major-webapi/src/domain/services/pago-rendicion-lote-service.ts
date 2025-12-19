import PagoRendicionLote from '../entities/pago-rendicion-lote';
import IPagoRendicionLoteRepository from '../repositories/pago-rendicion-lote-repository';
import { isValidDate, isValidString, isValidObject,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoRendicionLoteService {

	pagoRendicionLoteRepository: IPagoRendicionLoteRepository;

	constructor(pagoRendicionLoteRepository: IPagoRendicionLoteRepository) {
		this.pagoRendicionLoteRepository = pagoRendicionLoteRepository;
	}

	async listPendienteEnvio() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionLoteRepository.listPendienteEnvio();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByLote(numeroLoteRendicion:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.pagoRendicionLoteRepository.findByLote(numeroLoteRendicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(pagoRendicionLote: PagoRendicionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(pagoRendicionLote.numeroLoteRendicion, true) ||
					!isValidDate(pagoRendicionLote.fechaRendicion, true) ||
					!isValidObject(pagoRendicionLote.pagosRendicion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoRendicionLoteRepository.add(pagoRendicionLote);

				resolve(result);
			}
			catch(error) {
				if (error instanceof ValidationError ||
					error instanceof ProcessError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async modifyEnvio(numeroLoteRendicion:string, fechaEnvio:Date, observacionEnvio:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLoteRendicion, true) ||
					!isValidDate(fechaEnvio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.pagoRendicionLoteRepository.findByLote(numeroLoteRendicion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.pagoRendicionLoteRepository.modifyEnvio(row.numeroLoteRendicion, fechaEnvio, observacionEnvio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyConfirmacion(numeroLoteRendicion:string, fechaConfirmacion:Date, observacionConfirmacion:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLoteRendicion, true) ||
					!isValidDate(fechaConfirmacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.pagoRendicionLoteRepository.findByLote(numeroLoteRendicion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.pagoRendicionLoteRepository.modifyConfirmacion(row.numeroLoteRendicion, fechaConfirmacion, observacionConfirmacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyError(numeroLoteRendicion:string, observacion:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLoteRendicion, true) ||
					!isValidString(observacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.pagoRendicionLoteRepository.findByLote(numeroLoteRendicion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.pagoRendicionLoteRepository.modifyError(row.numeroLoteRendicion, observacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
