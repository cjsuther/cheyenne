import ITipoMovimientoRepository from '../../../domain/repositories/tipo-movimiento-repository';
import TipoMovimientoModel from './models/tipo-movimiento-model';
import TipoMovimiento from '../../../domain/entities/tipo-movimiento';

export default class TipoMovimientoRepositorySequelize implements ITipoMovimientoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoMovimientoModel.findAll();
		const result = data.map((row) => new TipoMovimiento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoMovimientoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoMovimiento(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigo(codigo:string) {
		const data = await TipoMovimientoModel.findOne({ where: { codigo: codigo } });
		const result = (data) ? new TipoMovimiento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoMovimiento) {
		const data = await TipoMovimientoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			actEmitido: row.actEmitido,
			automatico: row.automatico,
			autonumerado: row.autonumerado,
			numero: row.numero,
			imputacion: row.imputacion,
			tipo: row.tipo
		});
		const result = new TipoMovimiento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoMovimiento) {
		const affectedCount = await TipoMovimientoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			actEmitido: row.actEmitido,
			automatico: row.automatico,
			autonumerado: row.autonumerado,
			numero: row.numero,
			imputacion: row.imputacion,
			tipo: row.tipo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoMovimientoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoMovimiento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoMovimientoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
