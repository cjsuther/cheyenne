import IMovimientoCajaRepository from '../../../domain/repositories/movimiento-caja-repository';
import MovimientoCajaModel from './models/movimiento-caja-model';
import MovimientoCaja from '../../../domain/entities/movimiento-caja';

export default class MovimientoCajaRepositorySequelize implements IMovimientoCajaRepository {

	constructor() {

	}

	async list() {
		const data = await MovimientoCajaModel.findAll();
		const result = data.map((row) => new MovimientoCaja(...row.getDataValues()));

		return result;
	}

	async listByCajaAsignacion(idCajaAsignacion:number) {
		const data = await MovimientoCajaModel.findAll({ where: { idCajaAsignacion: idCajaAsignacion } });
		const result = data.map((row) => new MovimientoCaja(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MovimientoCajaModel.findOne({ where: { id: id } });
		const result = (data) ? new MovimientoCaja(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MovimientoCaja) {
		const data = await MovimientoCajaModel.create({
			idCaja: row.idCaja,
			idCajaAsignacion: row.idCajaAsignacion,
			idTipoMovimientoCaja: row.idTipoMovimientoCaja,
			importeCobro: row.importeCobro,
			fechaCobro: row.fechaCobro,
			observacion: row.observacion
		});
		const result = new MovimientoCaja(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MovimientoCaja) {
		const affectedCount = await MovimientoCajaModel.update({
			idCaja: row.idCaja,
			idCajaAsignacion: row.idCajaAsignacion,
			idTipoMovimientoCaja: row.idTipoMovimientoCaja,
			importeCobro: row.importeCobro,
			fechaCobro: row.fechaCobro,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MovimientoCajaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MovimientoCaja(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MovimientoCajaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
