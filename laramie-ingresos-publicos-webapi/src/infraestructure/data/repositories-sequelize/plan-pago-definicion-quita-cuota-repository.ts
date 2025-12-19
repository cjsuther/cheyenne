import IPlanPagoDefinicionQuitaCuotaRepository from '../../../domain/repositories/plan-pago-definicion-quita-cuota-repository';
import PlanPagoDefinicionQuitaCuotaModel from './models/plan-pago-definicion-quita-cuota-model';
import PlanPagoDefinicionQuitaCuota from '../../../domain/entities/plan-pago-definicion-quita-cuota';
import PlanPagoDefinicionQuitaCuotaState from '../../../domain/dto/plan-pago-definicion-quita-cuota-state';

export default class PlanPagoDefinicionQuitaCuotaRepositorySequelize implements IPlanPagoDefinicionQuitaCuotaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionQuitaCuotaModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionQuitaCuota(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionQuitaCuotaModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionQuitaCuotaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionQuitaCuotaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionQuitaCuota(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionQuitaCuota) {
		const data = await PlanPagoDefinicionQuitaCuotaModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			porcentajeQuitaRecargos: row.porcentajeQuitaRecargos,
			porcentajeQuitaMultaInfracciones: row.porcentajeQuitaMultaInfracciones,
			porcentajeQuitaHonorarios: row.porcentajeQuitaHonorarios,
			porcentajeQuitaAportes: row.porcentajeQuitaAportes
		});
		const result = new PlanPagoDefinicionQuitaCuota(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionQuitaCuota) {
		const affectedCount = await PlanPagoDefinicionQuitaCuotaModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			porcentajeQuitaRecargos: row.porcentajeQuitaRecargos,
			porcentajeQuitaMultaInfracciones: row.porcentajeQuitaMultaInfracciones,
			porcentajeQuitaHonorarios: row.porcentajeQuitaHonorarios,
			porcentajeQuitaAportes: row.porcentajeQuitaAportes
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionQuitaCuotaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionQuitaCuota(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionQuitaCuotaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionQuitaCuotaModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
