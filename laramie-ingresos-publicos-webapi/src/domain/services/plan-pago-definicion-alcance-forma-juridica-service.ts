import PlanPagoDefinicionAlcanceFormaJuridica from '../entities/plan-pago-definicion-alcance-forma-juridica';
import IPlanPagoDefinicionAlcanceFormaJuridicaRepository from '../repositories/plan-pago-definicion-alcance-forma-juridica-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionAlcanceFormaJuridicaService {

	planPagoDefinicionAlcanceFormaJuridicaRepository: IPlanPagoDefinicionAlcanceFormaJuridicaRepository;

	constructor(planPagoDefinicionAlcanceFormaJuridicaRepository: IPlanPagoDefinicionAlcanceFormaJuridicaRepository) {
		this.planPagoDefinicionAlcanceFormaJuridicaRepository = planPagoDefinicionAlcanceFormaJuridicaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.list();
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
				const result = (await this.planPagoDefinicionAlcanceFormaJuridicaRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionAlcanceFormaJuridica>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.findById(id);
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

	async add(planPagoDefinicionAlcanceFormaJuridica: PlanPagoDefinicionAlcanceFormaJuridica) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceFormaJuridica.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceFormaJuridica.idFormaJuridica, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionAlcanceFormaJuridica.id = null;
				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.add(planPagoDefinicionAlcanceFormaJuridica);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionAlcanceFormaJuridica: PlanPagoDefinicionAlcanceFormaJuridica) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionAlcanceFormaJuridica.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionAlcanceFormaJuridica.idFormaJuridica, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.modify(id, planPagoDefinicionAlcanceFormaJuridica);
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
				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.remove(id);
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
				const result = await this.planPagoDefinicionAlcanceFormaJuridicaRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
