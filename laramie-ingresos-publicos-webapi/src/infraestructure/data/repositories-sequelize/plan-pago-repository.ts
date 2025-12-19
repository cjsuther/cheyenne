import { Sequelize, Op } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPlanPagoRepository from '../../../domain/repositories/plan-pago-repository';
import PlanPagoModel from './models/plan-pago-model';
import PlanPago from '../../../domain/entities/plan-pago';
import TipoPlanPagoModel from './models/tipo-plan-pago-model';
import TipoPlanPago from '../../../domain/entities/tipo-plan-pago';

export default class PlanPagoRepositorySequelize implements IPlanPagoRepository {

	constructor() {

	}

	async list() {
		const data = await PlanPagoModel.findAll();
		const result = data.map((row) => new PlanPago(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await PlanPagoModel.findAll({ where: { idCuenta: idCuenta } });
		const result = data.map((row) => new PlanPago(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PlanPagoModel.findOne({ where: { id: id },
			include: [
				{ model: TipoPlanPagoModel, as: 'tipoPlanPago' }
            ]
		});
		let result = null;
		if (data) {
			const tipoPlanPago = data["tipoPlanPago"];
			let planPago = new PlanPago(...data.getDataValues());
			planPago.tipoPlanPago = new TipoPlanPago(...tipoPlanPago.getDataValues());
			result = planPago;
		}

		return result;
	}

	async add(row:PlanPago) {
		const data = await PlanPagoModel.create({
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idSubTasaPlanPago: row.idSubTasaPlanPago,
			idSubTasaInteres: row.idSubTasaInteres,
			idSubTasaSellados: row.idSubTasaSellados,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			numero: row.numero,
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTributo: row.idTributo,
			idCuenta: row.idCuenta,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta,
			idVinculoCuenta: row.idVinculoCuenta,
			importeNominal: row.importeNominal,
			importeAccesorios: row.importeAccesorios,
			importeCapital: row.importeCapital,
			importeIntereses: row.importeIntereses,
			importeSellados: row.importeSellados,
			importeGastosCausidicos: row.importeGastosCausidicos,
			importeQuita: row.importeQuita,
			importeQuitaDevengar: row.importeQuitaDevengar,
			importePlanPago: row.importePlanPago,
			idUsuarioFirmante: row.idUsuarioFirmante,
			idUsuarioRegistro: row.idUsuarioRegistro,
			fechaRegistro: row.fechaRegistro
		});
		const result = new PlanPago(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PlanPago) {
		const affectedCount = await PlanPagoModel.update({
			idTipoPlanPago: row.idTipoPlanPago,
			idTipoTributo: row.idTipoTributo,
			idSubTasaPlanPago: row.idSubTasaPlanPago,
			idSubTasaInteres: row.idSubTasaInteres,
			idSubTasaSellados: row.idSubTasaSellados,
			idSubTasaGastosCausidicos: row.idSubTasaGastosCausidicos,
			codigo: row.codigo,
			descripcion: row.descripcion,
			numero: row.numero,
			idPlanPagoDefinicion: row.idPlanPagoDefinicion,
			idTributo: row.idTributo,
			idCuenta: row.idCuenta,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta,
			idVinculoCuenta: row.idVinculoCuenta,
			importeNominal: row.importeNominal,
			importeAccesorios: row.importeAccesorios,
			importeCapital: row.importeCapital,
			importeIntereses: row.importeIntereses,
			importeSellados: row.importeSellados,
			importeGastosCausidicos: row.importeGastosCausidicos,
			importeQuita: row.importeQuita,
			importeQuitaDevengar: row.importeQuitaDevengar,
			importePlanPago: row.importePlanPago,
			idUsuarioFirmante: row.idUsuarioFirmante,
			idUsuarioRegistro: row.idUsuarioRegistro,
			fechaRegistro: row.fechaRegistro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PlanPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PlanPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PlanPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PlanPagoModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
