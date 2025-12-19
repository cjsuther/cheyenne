import IPlanPagoDefinicionAlcanceTasaRepository from '../../../domain/repositories/plan-pago-definicion-alcance-tasa-repository';
import PlanPagoDefinicionAlcanceTasaModel from './models/plan-pago-definicion-alcance-tasa-model';
import PlanPagoDefinicionAlcanceTasa from '../../../domain/entities/plan-pago-definicion-alcance-tasa';
import PlanPagoDefinicionAlcanceTasaState from '../../../domain/dto/plan-pago-definicion-alcance-tasa-state';

export default class PlanPagoDefinicionAlcanceTasaRepositorySequelize implements IPlanPagoDefinicionAlcanceTasaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionAlcanceTasaModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionAlcanceTasa(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionAlcanceTasaModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionAlcanceTasaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionAlcanceTasaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionAlcanceTasa(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionAlcanceTasa) {
		const data = await PlanPagoDefinicionAlcanceTasaModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa
		});
		const result = new PlanPagoDefinicionAlcanceTasa(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionAlcanceTasa) {
		const affectedCount = await PlanPagoDefinicionAlcanceTasaModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionAlcanceTasaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionAlcanceTasa(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceTasaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionAlcanceTasaModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
