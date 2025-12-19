import PlanPagoDefinicionAlcanceTasa from '../entities/plan-pago-definicion-alcance-tasa';
import IPlanPagoDefinicionAlcanceTasaRepository from '../repositories/plan-pago-definicion-alcance-tasa-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceTasaService {

	planPagoDefinicionAlcanceTasaRepository: IPlanPagoDefinicionAlcanceTasaRepository;

	constructor(planPagoDefinicionAlcanceTasaRepository: IPlanPagoDefinicionAlcanceTasaRepository) {
		this.planPagoDefinicionAlcanceTasaRepository = planPagoDefinicionAlcanceTasaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceTasaRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceTasaRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceTasa>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceTasaRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceTasa: PlanPagoDefinicionAlcanceTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceTasa.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceTasa.idTasa, true) ||
					!isValidInteger(planPagoDefinicionAlcanceTasa.idSubTasa, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceTasa.id = null;
				const result = await this.planPagoDefinicionAlcanceTasaRepository.add(planPagoDefinicionAlcanceTasa);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceTasa: PlanPagoDefinicionAlcanceTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceTasa.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceTasa.idTasa, true) ||
					!isValidInteger(planPagoDefinicionAlcanceTasa.idSubTasa, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceTasaRepository.modify(id, planPagoDefinicionAlcanceTasa);
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
				const result = await this.planPagoDefinicionAlcanceTasaRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceTasaRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
