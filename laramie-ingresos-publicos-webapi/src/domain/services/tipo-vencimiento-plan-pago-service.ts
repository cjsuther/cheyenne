import TipoVencimientoPlanPago from '../entities/tipo-vencimiento-plan-pago';
import ITipoVencimientoPlanPagoRepository from '../repositories/tipo-vencimiento-plan-pago-repository';
import { isValidString, isValidBoolean, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoVencimientoPlanPagoService {

	tipoVencimientoPlanPagoRepository: ITipoVencimientoPlanPagoRepository;

	constructor(tipoVencimientoPlanPagoRepository: ITipoVencimientoPlanPagoRepository) {
		this.tipoVencimientoPlanPagoRepository = tipoVencimientoPlanPagoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoVencimientoPlanPagoRepository.list();
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
				const result = await this.tipoVencimientoPlanPagoRepository.findById(id);
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

	async add(tipoVencimientoPlanPago: TipoVencimientoPlanPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoVencimientoPlanPago.descripcion, true) ||
					!isValidBoolean(tipoVencimientoPlanPago.baseDiaActual) ||
					!isValidBoolean(tipoVencimientoPlanPago.baseDiaFinMes) ||
					!isValidBoolean(tipoVencimientoPlanPago.habiles) ||
					!isValidBoolean(tipoVencimientoPlanPago.proximoHabil) ||
					!isValidBoolean(tipoVencimientoPlanPago.anteriorHabil) ||
					!isValidInteger(tipoVencimientoPlanPago.dias, true) ||
					!isValidInteger(tipoVencimientoPlanPago.meses, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoVencimientoPlanPago.id = null;
				const result = await this.tipoVencimientoPlanPagoRepository.add(tipoVencimientoPlanPago);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoVencimientoPlanPago: TipoVencimientoPlanPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoVencimientoPlanPago.descripcion, true) ||
					!isValidBoolean(tipoVencimientoPlanPago.baseDiaActual) ||
					!isValidBoolean(tipoVencimientoPlanPago.baseDiaFinMes) ||
					!isValidBoolean(tipoVencimientoPlanPago.habiles) ||
					!isValidBoolean(tipoVencimientoPlanPago.proximoHabil) ||
					!isValidBoolean(tipoVencimientoPlanPago.anteriorHabil) ||
					!isValidInteger(tipoVencimientoPlanPago.dias, true) ||
					!isValidInteger(tipoVencimientoPlanPago.meses, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoVencimientoPlanPagoRepository.modify(id, tipoVencimientoPlanPago);
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
				const result = await this.tipoVencimientoPlanPagoRepository.remove(id);
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
