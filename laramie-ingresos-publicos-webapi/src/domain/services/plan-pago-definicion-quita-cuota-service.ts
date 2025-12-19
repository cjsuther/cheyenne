import PlanPagoDefinicionQuitaCuota from '../entities/plan-pago-definicion-quita-cuota';
import IPlanPagoDefinicionQuitaCuotaRepository from '../repositories/plan-pago-definicion-quita-cuota-repository';
import { isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionQuitaCuotaService {

	planPagoDefinicionQuitaCuotaRepository: IPlanPagoDefinicionQuitaCuotaRepository;

	constructor(planPagoDefinicionQuitaCuotaRepository: IPlanPagoDefinicionQuitaCuotaRepository) {
		this.planPagoDefinicionQuitaCuotaRepository = planPagoDefinicionQuitaCuotaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionQuitaCuotaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.planPagoDefinicionQuitaCuotaRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionQuitaCuota>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionQuitaCuotaRepository.findById(id);
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

	async add(planPagoDefinicionQuitaCuota: PlanPagoDefinicionQuitaCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionQuitaCuota.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionQuitaCuota.cuotaDesde, true) ||
					!isValidInteger(planPagoDefinicionQuitaCuota.cuotaHasta, false) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaRecargos, false) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaMultaInfracciones, false) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaHonorarios, false) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaAportes, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (planPagoDefinicionQuitaCuota.porcentajeQuitaRecargos <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaMultaInfracciones <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaHonorarios <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaAportes <= 0)
				{
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionQuitaCuota.id = null;
				const result = await this.planPagoDefinicionQuitaCuotaRepository.add(planPagoDefinicionQuitaCuota);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionQuitaCuota: PlanPagoDefinicionQuitaCuota) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionQuitaCuota.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionQuitaCuota.cuotaDesde, true) ||
					!isValidInteger(planPagoDefinicionQuitaCuota.cuotaHasta, true) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaRecargos, true) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaMultaInfracciones, true) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaHonorarios, true) ||
					!isValidFloat(planPagoDefinicionQuitaCuota.porcentajeQuitaAportes, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (planPagoDefinicionQuitaCuota.porcentajeQuitaRecargos <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaMultaInfracciones <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaHonorarios <= 0 &&
					planPagoDefinicionQuitaCuota.porcentajeQuitaAportes <= 0)
				{
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionQuitaCuotaRepository.modify(id, planPagoDefinicionQuitaCuota);
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
				const result = await this.planPagoDefinicionQuitaCuotaRepository.remove(id);
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

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionQuitaCuotaRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
