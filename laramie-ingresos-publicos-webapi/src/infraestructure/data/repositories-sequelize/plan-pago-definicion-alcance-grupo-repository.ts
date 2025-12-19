import IPlanPagoDefinicionAlcanceGrupoRepository from '../../../domain/repositories/plan-pago-definicion-alcance-grupo-repository';
import PlanPagoDefinicionAlcanceGrupoModel from './models/plan-pago-definicion-alcance-grupo-model';
import PlanPagoDefinicionAlcanceGrupo from '../../../domain/entities/plan-pago-definicion-alcance-grupo';
import PlanPagoDefinicionAlcanceGrupoState from '../../../domain/dto/plan-pago-definicion-alcance-grupo-state';

export default class PlanPagoDefinicionAlcanceGrupoRepositorySequelize implements IPlanPagoDefinicionAlcanceGrupoRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceGrupoModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceGrupo(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceGrupoModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceGrupoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceGrupoModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceGrupo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceGrupo) {
		const data = await PlanPagoDefinicionAlcanceGrupoModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idGrupo: row.idGrupo
		});
		const result = new PlanPagoDefinicionAlcanceGrupo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceGrupo) {
		const affectedCount = await PlanPagoDefinicionAlcanceGrupoModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idGrupo: row.idGrupo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceGrupoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceGrupo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceGrupoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceGrupoModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
