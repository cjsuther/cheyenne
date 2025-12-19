import IEmisionNumeracionRepository from '../../../domain/repositories/emision-numeracion-repository';
import EmisionNumeracionModel from './models/emision-numeracion-model';
import EmisionNumeracion from '../../../domain/entities/emision-numeracion';

export default class EmisionNumeracionRepositorySequelize implements IEmisionNumeracionRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionNumeracionModel.findAll();
		const result = data.map((row) => new EmisionNumeracion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionNumeracionModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionNumeracion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionNumeracion) {
		const data = await EmisionNumeracionModel.create({
			nombre: row.nombre,
			idTipoTributo: row.idTipoTributo,
			valorProximo: row.valorProximo,
			valorReservadoDesde: row.valorReservadoDesde,
			valorReservadoHasta: row.valorReservadoHasta,
			idEmisionEjecucionBloqueo: row.idEmisionEjecucionBloqueo
		});
		const result = new EmisionNumeracion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:EmisionNumeracion) {
		const affectedCount = await EmisionNumeracionModel.update({
			nombre: row.nombre,
			idTipoTributo: row.idTipoTributo,
			valorProximo: row.valorProximo,
			valorReservadoDesde: row.valorReservadoDesde,
			valorReservadoHasta: row.valorReservadoHasta,
			idEmisionEjecucionBloqueo: row.idEmisionEjecucionBloqueo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionNumeracionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionNumeracion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionNumeracionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
