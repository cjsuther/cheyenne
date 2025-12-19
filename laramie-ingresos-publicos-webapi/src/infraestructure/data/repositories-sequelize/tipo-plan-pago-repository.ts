import ITipoPlanPagoRepository from '../../../domain/repositories/tipo-plan-pago-repository';
import TipoPlanPagoModel from './models/tipo-plan-pago-model';
import TipoPlanPago from '../../../domain/entities/tipo-plan-pago';

export default class TipoPlanPagoRepositorySequelize implements ITipoPlanPagoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoPlanPagoModel.findAll();
		const result = data.map((row) => new TipoPlanPago(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoPlanPagoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoPlanPago(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoPlanPago) {
		const data = await TipoPlanPagoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			idTipoTributo: row.idTipoTributo,
			convenio: row.convenio,
			condiciones: row.condiciones
		});
		const result = new TipoPlanPago(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoPlanPago) {
		const affectedCount = await TipoPlanPagoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			idTipoTributo: row.idTipoTributo,
			convenio: row.convenio,
			condiciones: row.condiciones
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoPlanPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoPlanPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoPlanPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
