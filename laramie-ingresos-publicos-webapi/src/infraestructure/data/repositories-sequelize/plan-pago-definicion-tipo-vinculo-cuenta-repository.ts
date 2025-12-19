import IPlanPagoDefinicionTipoVinculoCuentaRepository from '../../../domain/repositories/plan-pago-definicion-tipo-vinculo-cuenta-repository';
import PlanPagoDefinicionTipoVinculoCuentaModel from './models/plan-pago-definicion-tipo-vinculo-cuenta-model';
import PlanPagoDefinicionTipoVinculoCuenta from '../../../domain/entities/plan-pago-definicion-tipo-vinculo-cuenta';
import PlanPagoDefinicionTipoVinculoCuentaState from '../../../domain/dto/plan-pago-definicion-tipo-vinculo-cuenta-state';

export default class PlanPagoDefinicionTipoVinculoCuentaRepositorySequelize implements IPlanPagoDefinicionTipoVinculoCuentaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionTipoVinculoCuentaModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionTipoVinculoCuenta(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionTipoVinculoCuentaModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionTipoVinculoCuentaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionTipoVinculoCuentaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionTipoVinculoCuenta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionTipoVinculoCuenta) {
		const data = await PlanPagoDefinicionTipoVinculoCuentaModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta
		});
		const result = new PlanPagoDefinicionTipoVinculoCuenta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionTipoVinculoCuenta) {
		const affectedCount = await PlanPagoDefinicionTipoVinculoCuentaModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionTipoVinculoCuentaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionTipoVinculoCuenta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionTipoVinculoCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionTipoVinculoCuentaModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
