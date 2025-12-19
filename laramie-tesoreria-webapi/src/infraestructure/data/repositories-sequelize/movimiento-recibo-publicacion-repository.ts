import IMovimientoReciboPublicacionRepository from '../../../domain/repositories/movimiento-recibo-publicacion-repository';
import MovimientoReciboPublicacionModel from './models/movimiento-recibo-publicacion-model';
import MovimientoReciboPublicacion from '../../../domain/entities/movimiento-recibo-publicacion';

export default class MovimientoReciboPublicacionRepositorySequelize implements IMovimientoReciboPublicacionRepository {

	constructor() {

	}

	async list() {
		const data = await MovimientoReciboPublicacionModel.findAll();
		const result = data.map((row) => new MovimientoReciboPublicacion(...row.getDataValues()));

		return result;
	}

	async listByMovimientoCaja(idMovimientoCaja:number) {
		const data = await MovimientoReciboPublicacionModel.findAll({ where: { idMovimientoCaja: idMovimientoCaja } });
		const result = data.map((row) => new MovimientoReciboPublicacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await MovimientoReciboPublicacionModel.findOne({ where: { id: id } });
		const result = (data) ? new MovimientoReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async findByReciboPublicacion(idReciboPublicacion:number) {
		const data = await MovimientoReciboPublicacionModel.findOne({ where: { idReciboPublicacion: idReciboPublicacion } });
		const result = (data) ? new MovimientoReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:MovimientoReciboPublicacion) {
		const data = await MovimientoReciboPublicacionModel.create({
			idMovimientoCaja: row.idMovimientoCaja,
			idReciboPublicacion: row.idReciboPublicacion,
			importeCobro: row.importeCobro
		});
		const result = new MovimientoReciboPublicacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:MovimientoReciboPublicacion) {
		const affectedCount = await MovimientoReciboPublicacionModel.update({
			idMovimientoCaja: row.idMovimientoCaja,
			idReciboPublicacion: row.idReciboPublicacion,
			importeCobro: row.importeCobro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await MovimientoReciboPublicacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new MovimientoReciboPublicacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await MovimientoReciboPublicacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByMovimientoCaja(idMovimientoCaja:number) {
		const affectedCount = await MovimientoReciboPublicacionModel.destroy({ where: { idMovimientoCaja: idMovimientoCaja } });
		const result = (affectedCount > 0) ? {idMovimientoCaja} : null;
		
		return result;
	}

}
