import IPlanPagoDefinicionInteresRepository from '../../../domain/repositories/plan-pago-definicion-interes-repository';
import PlanPagoDefinicionInteresModel from './models/plan-pago-definicion-interes-model';
import PlanPagoDefinicionInteres from '../../../domain/entities/plan-pago-definicion-interes';
import PlanPagoDefinicionInteresState from '../../../domain/dto/plan-pago-definicion-interes-state';

export default class PlanPagoDefinicionInteresRepositorySequelize implements IPlanPagoDefinicionInteresRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoDefinicionInteresModel.findAll();
		const result = data.map((row) => new PlanPagoDefinicionInteres(...row.getDataValues()));

		return result;
	}

	async listByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const data = await PlanPagoDefinicionInteresModel.findAll({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = data.map((row) => new PlanPagoDefinicionInteresState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoDefinicionInteresModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoDefinicionInteres(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoDefinicionInteres) {
		const data = await PlanPagoDefinicionInteresModel.create({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			porcentajeInteres: row.porcentajeInteres
		});
		const result = new PlanPagoDefinicionInteres(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoDefinicionInteres) {
		const affectedCount = await PlanPagoDefinicionInteresModel.update({
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			cuotaDesde: row.cuotaDesde,
			cuotaHasta: row.cuotaHasta,
			porcentajeInteres: row.porcentajeInteres
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoDefinicionInteresModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoDefinicionInteres(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoDefinicionInteresModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPlanPagoDefinicion(idPlanPagoDefinicion:number) {
		const affectedCount = await PlanPagoDefinicionInteresModel.destroy({ where: { idPlanPagoDefinicion: idPlanPagoDefinicion } });
		const result = (affectedCount > 0) ? {idPlanPagoDefinicion} : null;
		
		return result;
	}

}
