import IPlanPagoCuotaRepository from '../../../domain/repositories/plan-pago-cuota-repository';
import PlanPagoCuotaModel from './models/plan-pago-cuota-model';
import PlanPagoCuota from '../../../domain/entities/plan-pago-cuota';
import { PLAN_PAGO_CUOTA_STATE } from '../../sdk/consts/planPagoCuotaState';

export default class PlanPagoCuotaRepositorySequelize implements IPlanPagoCuotaRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoCuotaModel.findAll();
		const result = data.map((row) => new PlanPagoCuota(...row.getDataValues()));

		return result;
	}

	async listByPlanPago(idPlanPago:number) {
		const data = await PlanPagoCuotaModel.findAll({ where: { idPlanPago: idPlanPago } });
		const result = data.map((row) => new PlanPagoCuota(...row.getDataValues()));

		return result;
	}

	async listByPendiente() {
		const data = await PlanPagoCuotaModel.findAll({ where: { idEstadoPlanPagoCuota: PLAN_PAGO_CUOTA_STATE.PENDIENTE } });
		const result = data.map((row) => new PlanPagoCuota(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoCuotaModel.findOne({ where: { id: id } });
		const result = (data) ? new PlanPagoCuota(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PlanPagoCuota) {
		const data = await PlanPagoCuotaModel.create({
			idPlanPago: row.idPlanPago,
			idEstadoPlanPagoCuota: row.idEstadoPlanPagoCuota,
			esAnticipo: row.esAnticipo,
			numero: row.numero,
			importeCapital: row.importeCapital,
			importeIntereses: row.importeIntereses,
			importeSellados: row.importeSellados,
			importeGastosCausidicos: row.importeGastosCausidicos,
			importeCuota: row.importeCuota,
			fechaVencimiento: row.fechaVencimiento,
			fechaPagado: row.fechaPagado
		});
		const result = new PlanPagoCuota(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPagoCuota) {
		const affectedCount = await PlanPagoCuotaModel.update({
			idPlanPago: row.idPlanPago,
			idEstadoPlanPagoCuota: row.idEstadoPlanPagoCuota,
			esAnticipo: row.esAnticipo,
			numero: row.numero,
			importeCapital: row.importeCapital,
			importeIntereses: row.importeIntereses,
			importeSellados: row.importeSellados,
			importeGastosCausidicos: row.importeGastosCausidicos,
			importeCuota: row.importeCuota,
			fechaVencimiento: row.fechaVencimiento,
			fechaPagado: row.fechaPagado
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoCuotaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPagoCuota(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoCuotaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
