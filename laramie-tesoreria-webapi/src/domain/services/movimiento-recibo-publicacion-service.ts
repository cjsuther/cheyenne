import MovimientoReciboPublicacion from '../entities/movimiento-recibo-publicacion';
import IMovimientoReciboPublicacionRepository from '../repositories/movimiento-recibo-publicacion-repository';
import { isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class MovimientoReciboPublicacionService {

	movimientoReciboPublicacionRepository: IMovimientoReciboPublicacionRepository;

	constructor(movimientoReciboPublicacionRepository: IMovimientoReciboPublicacionRepository) {
		this.movimientoReciboPublicacionRepository = movimientoReciboPublicacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.movimientoReciboPublicacionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByMovimientoCaja(idMovimientoCaja:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.movimientoReciboPublicacionRepository.listByMovimientoCaja(idMovimientoCaja);
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
				const result = await this.movimientoReciboPublicacionRepository.findById(id);
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

	async findByReciboPublicacion(idReciboPublicacion: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.movimientoReciboPublicacionRepository.findByReciboPublicacion(idReciboPublicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(movimientoReciboPublicacion: MovimientoReciboPublicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoReciboPublicacion.idMovimientoCaja, true) ||
					!isValidInteger(movimientoReciboPublicacion.idReciboPublicacion, true) ||
					!isValidFloat(movimientoReciboPublicacion.importeCobro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				movimientoReciboPublicacion.id = null;
				const result = await this.movimientoReciboPublicacionRepository.add(movimientoReciboPublicacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, movimientoReciboPublicacion: MovimientoReciboPublicacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoReciboPublicacion.idMovimientoCaja, true) ||
					!isValidInteger(movimientoReciboPublicacion.idReciboPublicacion, true) ||
					!isValidFloat(movimientoReciboPublicacion.importeCobro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.movimientoReciboPublicacionRepository.modify(id, movimientoReciboPublicacion);
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
				const result = await this.movimientoReciboPublicacionRepository.remove(id);
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
