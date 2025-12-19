import ITipoVencimientoPlanPagoRepository from '../../../domain/repositories/tipo-vencimiento-plan-pago-repository';
import TipoVencimientoPlanPagoModel from './models/tipo-vencimiento-plan-pago-model';
import TipoVencimientoPlanPago from '../../../domain/entities/tipo-vencimiento-plan-pago';

export default class TipoVencimientoPlanPagoRepositorySequelize implements ITipoVencimientoPlanPagoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoVencimientoPlanPagoModel.findAll();
		const result = data.map((row) => new TipoVencimientoPlanPago(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoVencimientoPlanPagoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoVencimientoPlanPago(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoVencimientoPlanPago) {
		const data = await TipoVencimientoPlanPagoModel.create({
			descripcion: row.descripcion,
			baseDiaActual: row.baseDiaActual,
			baseDiaFinMes: row.baseDiaFinMes,
			habiles: row.habiles,
			proximoHabil: row.proximoHabil,
			anteriorHabil: row.anteriorHabil,
			dias: row.dias,
			meses: row.meses
		});
		const result = new TipoVencimientoPlanPago(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoVencimientoPlanPago) {
		const affectedCount = await TipoVencimientoPlanPagoModel.update({
			descripcion: row.descripcion,
			baseDiaActual: row.baseDiaActual,
			baseDiaFinMes: row.baseDiaFinMes,
			habiles: row.habiles,
			proximoHabil: row.proximoHabil,
			anteriorHabil: row.anteriorHabil,
			dias: row.dias,
			meses: row.meses
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoVencimientoPlanPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoVencimientoPlanPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoVencimientoPlanPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
