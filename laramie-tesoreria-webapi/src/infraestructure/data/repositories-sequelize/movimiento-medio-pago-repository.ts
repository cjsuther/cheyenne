import IMovimientoMedioPagoRepository from '../../../domain/repositories/movimiento-medio-pago-repository';
import MovimientoMedioPagoModel from './models/movimiento-medio-pago-model';
import MovimientoMedioPago from '../../../domain/entities/movimiento-medio-pago';

export default class MovimientoMedioPagoRepositorySequelize implements IMovimientoMedioPagoRepository {

	constructor() {

	}

	async list() {
		const data = await MovimientoMedioPagoModel.findAll();
		const result = data.map((row) => new MovimientoMedioPago(...row.getDataValues()));

		return result;
	}

	async listByMovimientoCaja(idMovimientoCaja:number) {
		const data = await MovimientoMedioPagoModel.findAll({ where: { idMovimientoCaja: idMovimientoCaja } });
		const result = data.map((row) => new MovimientoMedioPago(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MovimientoMedioPagoModel.findOne({ where: { id: id } });
		const result = (data) ? new MovimientoMedioPago(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MovimientoMedioPago) {
		const data = await MovimientoMedioPagoModel.create({
			idMovimientoCaja: row.idMovimientoCaja,
			idMedioPago: row.idMedioPago,
			numeroMedioPago: row.numeroMedioPago,
			bancoMedioPago: row.bancoMedioPago,
			importeCobro: row.importeCobro
		});
		const result = new MovimientoMedioPago(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MovimientoMedioPago) {
		const affectedCount = await MovimientoMedioPagoModel.update({
			idMovimientoCaja: row.idMovimientoCaja,
			idMedioPago: row.idMedioPago,
			numeroMedioPago: row.numeroMedioPago,
			bancoMedioPago: row.bancoMedioPago,
			importeCobro: row.importeCobro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MovimientoMedioPagoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MovimientoMedioPago(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MovimientoMedioPagoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByMovimientoCaja(idMovimientoCaja:number) {
		const affectedCount = await MovimientoMedioPagoModel.destroy({ where: { idMovimientoCaja: idMovimientoCaja } });
		const result = (affectedCount > 0) ? {idMovimientoCaja} : null;
		
		return result;
	}

}
