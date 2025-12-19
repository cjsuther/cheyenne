import IPlanPagoDefinicionAlcanceCondicionFiscalRepository from '../../../domain/repositories/plan-pago-definicion-alcance-condicion-fiscal-repository';
import PlanPagoDefinicionAlcanceCondicionFiscalModel from './models/plan-pago-definicion-alcance-condicion-fiscal-model';
import PlanPagoDefinicionAlcanceCondicionFiscal from '../../../domain/entities/plan-pago-definicion-alcance-condicion-fiscal';
import PlanPagoDefinicionAlcanceCondicionFiscalState from '../../../domain/dto/plan-pago-definicion-alcance-condicion-fiscal-state';

export default class PlanPagoDefinicionAlcanceCondicionFiscalRepositorySequelize implements IPlanPagoDefinicionAlcanceCondicionFiscalRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceCondicionFiscalModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceCondicionFiscal(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceCondicionFiscalModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceCondicionFiscalState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceCondicionFiscalModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceCondicionFiscal(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceCondicionFiscal) {
		const data = await PlanPagoDefinicionAlcanceCondicionFiscalModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idCondicionFiscal: row.idCondicionFiscal
		});
		const result = new PlanPagoDefinicionAlcanceCondicionFiscal(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceCondicionFiscal) {
		const affectedCount = await PlanPagoDefinicionAlcanceCondicionFiscalModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idCondicionFiscal: row.idCondicionFiscal
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceCondicionFiscalModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceCondicionFiscal(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceCondicionFiscalModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceCondicionFiscalModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
