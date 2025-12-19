import IPlanPagoDefinicionAlcanceFormaJuridicaRepository from '../../../domain/repositories/plan-pago-definicion-alcance-forma-juridica-repository';
import PlanPagoDefinicionAlcanceFormaJuridicaModel from './models/plan-pago-definicion-alcance-forma-juridica-model';
import PlanPagoDefinicionAlcanceFormaJuridica from '../../../domain/entities/plan-pago-definicion-alcance-forma-juridica';
import PlanPagoDefinicionAlcanceFormaJuridicaState from '../../../domain/dto/plan-pago-definicion-alcance-forma-juridica-state';

export default class PlanPagoDefinicionAlcanceFormaJuridicaRepositorySequelize implements IPlanPagoDefinicionAlcanceFormaJuridicaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceFormaJuridicaModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceFormaJuridica(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceFormaJuridicaModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceFormaJuridicaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceFormaJuridicaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceFormaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceFormaJuridica) {
		const data = await PlanPagoDefinicionAlcanceFormaJuridicaModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idFormaJuridica: row.idFormaJuridica
		});
		const result = new PlanPagoDefinicionAlcanceFormaJuridica(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceFormaJuridica) {
		const affectedCount = await PlanPagoDefinicionAlcanceFormaJuridicaModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idFormaJuridica: row.idFormaJuridica
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceFormaJuridicaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceFormaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceFormaJuridicaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceFormaJuridicaModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
