import Mensaje from '../entities/mensaje';
import IMensajeRepository from '../repositories/mensaje-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class MensajeService {

	mensajeRepository: IMensajeRepository;

	constructor(mensajeRepository: IMensajeRepository) {
		this.mensajeRepository = mensajeRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.mensajeRepository.list();
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
				const result = await this.mensajeRepository.findById(id);
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

	async add(mensaje: Mensaje) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(mensaje.idTipoMensaje, true) ||
					!isValidInteger(mensaje.idEstadoMensaje, true) ||
					!isValidInteger(mensaje.idCanal, true) ||
					!isValidInteger(mensaje.idPrioridad, true) ||
					!isValidString(mensaje.identificador, true) ||
					!isValidString(mensaje.titulo, true) ||
					!isValidString(mensaje.cuerpo, true) ||
					!isValidInteger(mensaje.idUsuarioCreacion, true) ||
					!isValidDate(mensaje.fechaCreacion, true) ||
					!isValidDate(mensaje.fechaRecepcion, true) ||
					!isValidDate(mensaje.fechaEnvio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				mensaje.id = null;
				const result = await this.mensajeRepository.add(mensaje);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, mensaje: Mensaje) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(mensaje.idTipoMensaje, true) ||
					!isValidInteger(mensaje.idEstadoMensaje, true) ||
					!isValidInteger(mensaje.idCanal, true) ||
					!isValidInteger(mensaje.idPrioridad, true) ||
					!isValidString(mensaje.identificador, true) ||
					!isValidString(mensaje.titulo, true) ||
					!isValidString(mensaje.cuerpo, true) ||
					!isValidInteger(mensaje.idUsuarioCreacion, true) ||
					!isValidDate(mensaje.fechaCreacion, true) ||
					!isValidDate(mensaje.fechaRecepcion, true) ||
					!isValidDate(mensaje.fechaEnvio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.mensajeRepository.modify(id, mensaje);
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
				const result = await this.mensajeRepository.remove(id);
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
