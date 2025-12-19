import PlanPagoCuota from '../entities/plan-pago-cuota';
import IPlanPagoCuotaRepository from '../repositories/plan-pago-cuota-repository';
import { isValidInteger, isValidNumber, isValidDate, isValidFloat, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoCuotaService {

	planPagoCuotaRepository: IPlanPagoCuotaRepository;

	constructor(planPagoCuotaRepository: IPlanPagoCuotaRepository) {
		this.planPagoCuotaRepository = planPagoCuotaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoCuotaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPlanPago(idPlanPago: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoCuotaRepository.listByPlanPago(idPlanPago);
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
				const result = await this.planPagoCuotaRepository.findById(id);
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

	async add(planPagoCuota: PlanPagoCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoCuota.idPlanPago, true) ||
					!isValidInteger(planPagoCuota.idEstadoPlanPagoCuota, true) ||
					!isValidBoolean(planPagoCuota.esAnticipo) ||
					!isValidInteger(planPagoCuota.numero, true) ||
					!isValidFloat(planPagoCuota.importeCapital, true) ||
					!isValidFloat(planPagoCuota.importeIntereses, true) ||
					!isValidFloat(planPagoCuota.importeSellados, true) ||
					!isValidFloat(planPagoCuota.importeGastosCausidicos, true) ||
					!isValidFloat(planPagoCuota.importeCuota, true) ||
					!isValidDate(planPagoCuota.fechaVencimiento, true) ||
					!isValidDate(planPagoCuota.fechaPagado, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoCuota.id = null;
				const result = await this.planPagoCuotaRepository.add(planPagoCuota);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoCuota: PlanPagoCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoCuota.idPlanPago, true) ||
					!isValidInteger(planPagoCuota.idEstadoPlanPagoCuota, true) ||
					!isValidBoolean(planPagoCuota.esAnticipo) ||
					!isValidInteger(planPagoCuota.numero, true) ||
					!isValidFloat(planPagoCuota.importeCapital, true) ||
					!isValidFloat(planPagoCuota.importeIntereses, true) ||
					!isValidFloat(planPagoCuota.importeSellados, true) ||
					!isValidFloat(planPagoCuota.importeGastosCausidicos, true) ||
					!isValidFloat(planPagoCuota.importeCuota, true) ||
					!isValidDate(planPagoCuota.fechaVencimiento, true) ||
					!isValidDate(planPagoCuota.fechaPagado, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoCuotaRepository.modify(id, planPagoCuota);
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
				const result = await this.planPagoCuotaRepository.remove(id);
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
