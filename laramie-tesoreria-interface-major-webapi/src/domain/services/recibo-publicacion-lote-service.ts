import ReciboPublicacionLote from '../entities/recibo-publicacion-lote';
import IReciboPublicacionLoteRepository from '../repositories/recibo-publicacion-lote-repository';
import { isValidDate, isValidString, isValidObject,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ReciboPublicacionLoteService {

	reciboPublicacionLoteRepository: IReciboPublicacionLoteRepository;

	constructor(reciboPublicacionLoteRepository: IReciboPublicacionLoteRepository) {
		this.reciboPublicacionLoteRepository = reciboPublicacionLoteRepository;
	}

	async listPendienteEnvio() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.reciboPublicacionLoteRepository.listPendienteEnvio();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByLote(numeroLotePublicacion:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.reciboPublicacionLoteRepository.findByLote(numeroLotePublicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(reciboPublicacionLote: ReciboPublicacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(reciboPublicacionLote.numeroLotePublicacion, true) ||
					!isValidDate(reciboPublicacionLote.fechaPublicacion, true) ||
					!isValidObject(reciboPublicacionLote.recibosPublicacion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.reciboPublicacionLoteRepository.findByLote(reciboPublicacionLote.numeroLotePublicacion);
				if (row) {
					reject(new ReferenceError('El lote ya fue ingresado anteriormente'));
					return;
				}

				const result = await this.reciboPublicacionLoteRepository.add(reciboPublicacionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyEnvio(numeroLotePublicacion:string, fechaEnvio:Date, observacionEnvio:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLotePublicacion, true) ||
					!isValidDate(fechaEnvio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.reciboPublicacionLoteRepository.findByLote(numeroLotePublicacion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.reciboPublicacionLoteRepository.modifyEnvio(row.numeroLotePublicacion, fechaEnvio, observacionEnvio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyConfirmacion(numeroLotePublicacion:string, fechaConfirmacion:Date, observacionConfirmacion:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLotePublicacion, true) ||
					!isValidDate(fechaConfirmacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.reciboPublicacionLoteRepository.findByLote(numeroLotePublicacion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.reciboPublicacionLoteRepository.modifyConfirmacion(row.numeroLotePublicacion, fechaConfirmacion, observacionConfirmacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyError(numeroLotePublicacion:string, observacion:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLotePublicacion, true) ||
					!isValidString(observacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const row = await this.reciboPublicacionLoteRepository.findByLote(numeroLotePublicacion);
				if (!row) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const result = await this.reciboPublicacionLoteRepository.modifyError(row.numeroLotePublicacion, observacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
