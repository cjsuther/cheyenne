import MovimientoCaja from '../entities/movimiento-caja';
import IMovimientoCajaRepository from '../repositories/movimiento-caja-repository';
import { isValidInteger, isValidString, isValidFloat, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import IMovimientoReciboPublicacionRepository from '../repositories/movimiento-recibo-publicacion-repository';
import IMovimientoMedioPagoRepository from '../repositories/movimiento-medio-pago-repository';

export default class MovimientoCajaService {

	movimientoCajaRepository: IMovimientoCajaRepository;
	movimientoMedioPagoRepository: IMovimientoMedioPagoRepository;
	movimientoReciboPublicacionRepository: IMovimientoReciboPublicacionRepository;

	constructor(movimientoCajaRepository: IMovimientoCajaRepository,
				movimientoMedioPagoRepository: IMovimientoMedioPagoRepository,
				movimientoReciboPublicacionRepository: IMovimientoReciboPublicacionRepository
	) {
		this.movimientoCajaRepository = movimientoCajaRepository;
		this.movimientoMedioPagoRepository = movimientoMedioPagoRepository;
		this.movimientoReciboPublicacionRepository = movimientoReciboPublicacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.movimientoCajaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCajaAsignacion(idCajaAsignacion:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.movimientoCajaRepository.listByCajaAsignacion(idCajaAsignacion);
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
				const result = await this.movimientoCajaRepository.findById(id);
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

	async add(movimientoCaja: MovimientoCaja) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoCaja.idCaja, true) ||
					!isValidInteger(movimientoCaja.idCajaAsignacion, true) ||
					!isValidInteger(movimientoCaja.idTipoMovimientoCaja, true) ||
					!isValidFloat(movimientoCaja.importeCobro, true) ||
					!isValidDate(movimientoCaja.fechaCobro, true) ||
					!isValidString(movimientoCaja.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				movimientoCaja.id = null;
				const result = await this.movimientoCajaRepository.add(movimientoCaja);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, movimientoCaja: MovimientoCaja) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(movimientoCaja.idCaja, true) ||
					!isValidInteger(movimientoCaja.idCajaAsignacion, true) ||
					!isValidInteger(movimientoCaja.idTipoMovimientoCaja, true) ||
					!isValidFloat(movimientoCaja.importeCobro, true) ||
					!isValidDate(movimientoCaja.fechaCobro, true) ||
					!isValidString(movimientoCaja.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.movimientoCajaRepository.modify(id, movimientoCaja);
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
				await this.movimientoMedioPagoRepository.removeByMovimientoCaja(id);
				await this.movimientoReciboPublicacionRepository.removeByMovimientoCaja(id);
				const result = await this.movimientoCajaRepository.remove(id);
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
