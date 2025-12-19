import ITipoRecargoDescuentoRepository from '../../../domain/repositories/tipo-recargo-descuento-repository';
import TipoRecargoDescuentoModel from './models/tipo-recargo-descuento-model';
import TipoRecargoDescuento from '../../../domain/entities/tipo-recargo-descuento';

export default class TipoRecargoDescuentoRepositorySequelize implements ITipoRecargoDescuentoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoRecargoDescuentoModel.findAll();
		const result = data.map((row) => new TipoRecargoDescuento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoRecargoDescuentoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoRecargoDescuento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoRecargoDescuento) {
		const data = await TipoRecargoDescuentoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			tipo: row.tipo,
			idTipoTributo: row.idTipoTributo,
			porcentaje: row.porcentaje,
			importe: row.importe,
			emiteSolicitud: row.emiteSolicitud,
			requiereOtrogamiento: row.requiereOtrogamiento,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			procedimiento: row.procedimiento
		});
		const result = new TipoRecargoDescuento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoRecargoDescuento) {
		const affectedCount = await TipoRecargoDescuentoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			tipo: row.tipo,
			idTipoTributo: row.idTipoTributo,
			porcentaje: row.porcentaje,
			importe: row.importe,
			emiteSolicitud: row.emiteSolicitud,
			requiereOtrogamiento: row.requiereOtrogamiento,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			procedimiento: row.procedimiento
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoRecargoDescuentoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoRecargoDescuento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoRecargoDescuentoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
