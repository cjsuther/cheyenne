import PlanPagoDefinicionAlcanceCondicionFiscal from '../entities/plan-pago-definicion-alcance-condicion-fiscal';
import IPlanPagoDefinicionAlcanceCondicionFiscalRepository from '../repositories/plan-pago-definicion-alcance-condicion-fiscal-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceCondicionFiscalService {

	planPagoDefinicionAlcanceCondicionFiscalRepository: IPlanPagoDefinicionAlcanceCondicionFiscalRepository;

	constructor(planPagoDefinicionAlcanceCondicionFiscalRepository: IPlanPagoDefinicionAlcanceCondicionFiscalRepository) {
		this.planPagoDefinicionAlcanceCondicionFiscalRepository = planPagoDefinicionAlcanceCondicionFiscalRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceCondicionFiscalRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceCondicionFiscal>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceCondicionFiscal: PlanPagoDefinicionAlcanceCondicionFiscal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceCondicionFiscal.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceCondicionFiscal.idCondicionFiscal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceCondicionFiscal.id = null;
				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.add(planPagoDefinicionAlcanceCondicionFiscal);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceCondicionFiscal: PlanPagoDefinicionAlcanceCondicionFiscal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceCondicionFiscal.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceCondicionFiscal.idCondicionFiscal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.modify(id, planPagoDefinicionAlcanceCondicionFiscal);
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
				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceCondicionFiscalRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
