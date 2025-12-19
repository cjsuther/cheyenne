import PlanPagoDefinicionInteres from '../entities/plan-pago-definicion-interes';
import IPlanPagoDefinicionInteresRepository from '../repositories/plan-pago-definicion-interes-repository';
import { isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionInteresService {

	planPagoDefinicionInteresRepository: IPlanPagoDefinicionInteresRepository;

	constructor(planPagoDefinicionInteresRepository: IPlanPagoDefinicionInteresRepository) {
		this.planPagoDefinicionInteresRepository = planPagoDefinicionInteresRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionInteresRepository.list();
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
				const result = (await this.planPagoDefinicionInteresRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionInteres>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionInteresRepository.findById(id);
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

	async add(planPagoDefinicionInteres: PlanPagoDefinicionInteres) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionInteres.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionInteres.cuotaDesde, true) ||
					!isValidInteger(planPagoDefinicionInteres.cuotaHasta, false) ||
					!isValidFloat(planPagoDefinicionInteres.porcentajeInteres, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionInteres.id = null;
				const result = await this.planPagoDefinicionInteresRepository.add(planPagoDefinicionInteres);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionInteres: PlanPagoDefinicionInteres) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionInteres.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionInteres.cuotaDesde, true) ||
					!isValidInteger(planPagoDefinicionInteres.cuotaHasta, false) ||
					!isValidFloat(planPagoDefinicionInteres.porcentajeInteres, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionInteresRepository.modify(id, planPagoDefinicionInteres);
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
				const result = await this.planPagoDefinicionInteresRepository.remove(id);
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
				const result = await this.planPagoDefinicionInteresRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
