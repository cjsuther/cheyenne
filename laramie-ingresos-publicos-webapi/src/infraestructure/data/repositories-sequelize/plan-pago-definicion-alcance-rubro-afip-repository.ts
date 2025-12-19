import IPlanPagoDefinicionAlcanceRubroAfipRepository from '../../../domain/repositories/plan-pago-definicion-alcance-rubro-afip-repository';
import PlanPagoDefinicionAlcanceRubroAfipModel from './models/plan-pago-definicion-alcance-rubro-afip-model';
import PlanPagoDefinicionAlcanceRubroAfip from '../../../domain/entities/plan-pago-definicion-alcance-rubro-afip';
import PlanPagoDefinicionAlcanceRubroAfipState from '../../../domain/dto/plan-pago-definicion-alcance-rubro-afip-state';

export default class PlanPagoDefinicionAlcanceRubroAfipRepositorySequelize implements IPlanPagoDefinicionAlcanceRubroAfipRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceRubroAfipModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceRubroAfip(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceRubroAfipModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceRubroAfipState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceRubroAfipModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceRubroAfip(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceRubroAfip) {
		const data = await PlanPagoDefinicionAlcanceRubroAfipModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idRubroAfip: row.idRubroAfip
		});
		const result = new PlanPagoDefinicionAlcanceRubroAfip(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceRubroAfip) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroAfipModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idRubroAfip: row.idRubroAfip
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceRubroAfipModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceRubroAfip(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroAfipModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroAfipModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
