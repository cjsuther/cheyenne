import IPlanPagoDefinicionAlcanceRubroRepository from '../../../domain/repositories/plan-pago-definicion-alcance-rubro-repository';
import PlanPagoDefinicionAlcanceRubroModel from './models/plan-pago-definicion-alcance-rubro-model';
import PlanPagoDefinicionAlcanceRubro from '../../../domain/entities/plan-pago-definicion-alcance-rubro';
import PlanPagoDefinicionAlcanceRubroState from '../../../domain/dto/plan-pago-definicion-alcance-rubro-state';

export default class PlanPagoDefinicionAlcanceRubroRepositorySequelize implements IPlanPagoDefinicionAlcanceRubroRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceRubroModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceRubro(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceRubroModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceRubroState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceRubroModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceRubro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceRubro) {
		const data = await PlanPagoDefinicionAlcanceRubroModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idRubro: row.idRubro
		});
		const result = new PlanPagoDefinicionAlcanceRubro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceRubro) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idRubro: row.idRubro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceRubroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceRubro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceRubroModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
