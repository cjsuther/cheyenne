import IPlanPagoDefinicionAlcanceZonaTarifariaRepository from '../../../domain/repositories/plan-pago-definicion-alcance-zona-tarifaria-repository';
import PlanPagoDefinicionAlcanceZonaTarifariaModel from './models/plan-pago-definicion-alcance-zona-tarifaria-model';
import PlanPagoDefinicionAlcanceZonaTarifaria from '../../../domain/entities/plan-pago-definicion-alcance-zona-tarifaria';
import PlanPagoDefinicionAlcanceZonaTarifariaState from '../../../domain/dto/plan-pago-definicion-alcance-zona-tarifaria-state';

export default class PlanPagoDefinicionAlcanceZonaTarifariaRepositorySequelize implements IPlanPagoDefinicionAlcanceZonaTarifariaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceZonaTarifariaModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceZonaTarifaria(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceZonaTarifariaModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceZonaTarifariaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceZonaTarifariaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceZonaTarifaria) {
		const data = await PlanPagoDefinicionAlcanceZonaTarifariaModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idZonaTarifaria: row.idZonaTarifaria
		});
		const result = new PlanPagoDefinicionAlcanceZonaTarifaria(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceZonaTarifaria) {
		const affectedCount = await PlanPagoDefinicionAlcanceZonaTarifariaModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idZonaTarifaria: row.idZonaTarifaria
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceZonaTarifariaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceZonaTarifariaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceZonaTarifariaModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
