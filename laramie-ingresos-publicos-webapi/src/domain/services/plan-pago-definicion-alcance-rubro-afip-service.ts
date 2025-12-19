import PlanPagoDefinicionAlcanceRubroAfip from '../entities/plan-pago-definicion-alcance-rubro-afip';
import IPlanPagoDefinicionAlcanceRubroAfipRepository from '../repositories/plan-pago-definicion-alcance-rubro-afip-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceRubroAfipService {

	planPagoDefinicionAlcanceRubroAfipRepository: IPlanPagoDefinicionAlcanceRubroAfipRepository;

	constructor(planPagoDefinicionAlcanceRubroAfipRepository: IPlanPagoDefinicionAlcanceRubroAfipRepository) {
		this.planPagoDefinicionAlcanceRubroAfipRepository = planPagoDefinicionAlcanceRubroAfipRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceRubroAfipRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceRubroAfip>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceRubroAfip: PlanPagoDefinicionAlcanceRubroAfip) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceRubroAfip.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceRubroAfip.idRubroAfip, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceRubroAfip.id = null;
				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.add(planPagoDefinicionAlcanceRubroAfip);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceRubroAfip: PlanPagoDefinicionAlcanceRubroAfip) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceRubroAfip.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceRubroAfip.idRubroAfip, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.modify(id, planPagoDefinicionAlcanceRubroAfip);
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
				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceRubroAfipRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
