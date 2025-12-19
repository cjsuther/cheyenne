import TipoPlanPago from '../entities/tipo-plan-pago';
import ITipoPlanPagoRepository from '../repositories/tipo-plan-pago-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoPlanPagoService {

	tipoPlanPagoRepository: ITipoPlanPagoRepository;

	constructor(tipoPlanPagoRepository: ITipoPlanPagoRepository) {
		this.tipoPlanPagoRepository = tipoPlanPagoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoPlanPagoRepository.list();
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
				const result = await this.tipoPlanPagoRepository.findById(id);
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

	async add(tipoPlanPago: TipoPlanPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoPlanPago.codigo, true) ||
					!isValidString(tipoPlanPago.nombre, true) ||
					!isValidInteger(tipoPlanPago.idTipoTributo, true) ||
					!isValidString(tipoPlanPago.convenio, true) ||
					!isValidString(tipoPlanPago.condiciones, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoPlanPago.id = null;
				const result = await this.tipoPlanPagoRepository.add(tipoPlanPago);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoPlanPago: TipoPlanPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoPlanPago.codigo, true) ||
					!isValidString(tipoPlanPago.nombre, true) ||
					!isValidInteger(tipoPlanPago.idTipoTributo, true) ||
					!isValidString(tipoPlanPago.convenio, true) ||
					!isValidString(tipoPlanPago.condiciones, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoPlanPagoRepository.modify(id, tipoPlanPago);
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
				const result = await this.tipoPlanPagoRepository.remove(id);
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
