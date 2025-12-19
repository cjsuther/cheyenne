import PlanPagoDefinicionAlcanceGrupo from '../entities/plan-pago-definicion-alcance-grupo';
import IPlanPagoDefinicionAlcanceGrupoRepository from '../repositories/plan-pago-definicion-alcance-grupo-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceGrupoService {

	planPagoDefinicionAlcanceGrupoRepository: IPlanPagoDefinicionAlcanceGrupoRepository;

	constructor(planPagoDefinicionAlcanceGrupoRepository: IPlanPagoDefinicionAlcanceGrupoRepository) {
		this.planPagoDefinicionAlcanceGrupoRepository = planPagoDefinicionAlcanceGrupoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceGrupoRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceGrupoRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceGrupo>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceGrupoRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceGrupo: PlanPagoDefinicionAlcanceGrupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceGrupo.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceGrupo.idGrupo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceGrupo.id = null;
				const result = await this.planPagoDefinicionAlcanceGrupoRepository.add(planPagoDefinicionAlcanceGrupo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceGrupo: PlanPagoDefinicionAlcanceGrupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceGrupo.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceGrupo.idGrupo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceGrupoRepository.modify(id, planPagoDefinicionAlcanceGrupo);
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
				const result = await this.planPagoDefinicionAlcanceGrupoRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceGrupoRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
