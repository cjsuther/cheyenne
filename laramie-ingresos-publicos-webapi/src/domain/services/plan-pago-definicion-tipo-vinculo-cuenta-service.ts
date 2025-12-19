import PlanPagoDefinicionTipoVinculoCuenta from '../entities/plan-pago-definicion-tipo-vinculo-cuenta';
import IPlanPagoDefinicionTipoVinculoCuentaRepository from '../repositories/plan-pago-definicion-tipo-vinculo-cuenta-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PlanPagoDefinicionTipoVinculoCuentaService {

	planPagoDefinicionTipoVinculoCuentaRepository: IPlanPagoDefinicionTipoVinculoCuentaRepository;

	constructor(planPagoDefinicionTipoVinculoCuentaRepository: IPlanPagoDefinicionTipoVinculoCuentaRepository) {
		this.planPagoDefinicionTipoVinculoCuentaRepository = planPagoDefinicionTipoVinculoCuentaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.list();
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
				const result = (await this.planPagoDefinicionTipoVinculoCuentaRepository.listByPlanPagoDefinicion(idPlanPagoDefinicion) as Array<PlanPagoDefinicionTipoVinculoCuenta>).sort((a, b) => a.id - b.id);
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
				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.findById(id);
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

	async add(planPagoDefinicionTipoVinculoCuenta: PlanPagoDefinicionTipoVinculoCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionTipoVinculoCuenta.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionTipoVinculoCuenta.idTipoVinculoCuenta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicionTipoVinculoCuenta.id = null;
				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.add(planPagoDefinicionTipoVinculoCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, planPagoDefinicionTipoVinculoCuenta: PlanPagoDefinicionTipoVinculoCuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPagoDefinicionTipoVinculoCuenta.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPagoDefinicionTipoVinculoCuenta.idTipoVinculoCuenta, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.modify(id, planPagoDefinicionTipoVinculoCuenta);
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
				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.remove(id);
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
				const result = await this.planPagoDefinicionTipoVinculoCuentaRepository.removeByPlanPagoDefinicion(idPlanPagoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
