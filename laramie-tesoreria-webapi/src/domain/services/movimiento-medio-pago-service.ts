import MovimientoMedioPago from '../entities/movimiento-medio-pago';
import IMovimientoMedioPagoRepository from '../repositories/movimiento-medio-pago-repository';
import { isValidInteger, isValidString, isValidNumber, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class MovimientoMedioPagoService {

	movimientoMedioPagoRepository: IMovimientoMedioPagoRepository;

	constructor(movimientoMedioPagoRepository: IMovimientoMedioPagoRepository) {
		this.movimientoMedioPagoRepository = movimientoMedioPagoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.movimientoMedioPagoRepository.list();
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
				const result = await this.movimientoMedioPagoRepository.listByMovimientoCaja(idMovimientoCaja);
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
				const result = await this.movimientoMedioPagoRepository.findById(id);
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

	async add(movimientoMedioPago: MovimientoMedioPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoMedioPago.idMovimientoCaja, true) ||
					!isValidInteger(movimientoMedioPago.idMedioPago, true) ||
					!isValidString(movimientoMedioPago.numeroMedioPago, false) ||
					!isValidString(movimientoMedioPago.bancoMedioPago, false) ||
					!isValidFloat(movimientoMedioPago.importeCobro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				movimientoMedioPago.id = null;
				const result = await this.movimientoMedioPagoRepository.add(movimientoMedioPago);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, movimientoMedioPago: MovimientoMedioPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoMedioPago.idMovimientoCaja, true) ||
					!isValidInteger(movimientoMedioPago.idMedioPago, true) ||
					!isValidString(movimientoMedioPago.numeroMedioPago, false) ||
					!isValidString(movimientoMedioPago.bancoMedioPago, false) ||
					!isValidFloat(movimientoMedioPago.importeCobro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.movimientoMedioPagoRepository.modify(id, movimientoMedioPago);
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
				const result = await this.movimientoMedioPagoRepository.remove(id);
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
