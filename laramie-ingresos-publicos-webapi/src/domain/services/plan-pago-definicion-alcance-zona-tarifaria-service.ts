import PlanPagoDefinicionAlcanceZonaTarifaria from '../entities/plan-pago-definicion-alcance-zona-tarifaria';
import IPlanPagoDefinicionAlcanceZonaTarifariaRepository from '../repositories/plan-pago-definicion-alcance-zona-tarifaria-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceZonaTarifariaService {

	planPagoDefinicionAlcanceZonaTarifariaRepository: IPlanPagoDefinicionAlcanceZonaTarifariaRepository;

	constructor(planPagoDefinicionAlcanceZonaTarifariaRepository: IPlanPagoDefinicionAlcanceZonaTarifariaRepository) {
		this.planPagoDefinicionAlcanceZonaTarifariaRepository = planPagoDefinicionAlcanceZonaTarifariaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceZonaTarifariaRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceZonaTarifaria>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceZonaTarifaria: PlanPagoDefinicionAlcanceZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceZonaTarifaria.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceZonaTarifaria.idZonaTarifaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceZonaTarifaria.id = null;
				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.add(planPagoDefinicionAlcanceZonaTarifaria);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceZonaTarifaria: PlanPagoDefinicionAlcanceZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceZonaTarifaria.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceZonaTarifaria.idZonaTarifaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.modify(id, planPagoDefinicionAlcanceZonaTarifaria);
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
				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceZonaTarifariaRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
