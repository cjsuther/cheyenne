import IObraInmuebleDetalleRepository from '../../../domain/repositories/obra-inmueble-detalle-repository';
import ObraInmuebleDetalleModel from './models/obra-inmueble-detalle-model';
import ObraInmuebleDetalle from '../../../domain/entities/obra-inmueble-detalle';

export default class ObraInmuebleDetalleRepositorySequelize implements IObraInmuebleDetalleRepository {

	constructor() {

	}

	async listByObraInmueble(idObraInmueble: number) {
		const data = await ObraInmuebleDetalleModel.findAll({ where: { idObraInmueble: idObraInmueble } });
		const result = data.map((row) => new ObraInmuebleDetalle(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ObraInmuebleDetalleModel.findOne({ where: { id: id } });
		const result = (data) ? new ObraInmuebleDetalle(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ObraInmuebleDetalle) {
		const data = await ObraInmuebleDetalleModel.create({
			idObraInmueble: row.idObraInmueble,
			idTipoObra: row.idTipoObra,
			idDestinoObra: row.idDestinoObra,
			idFormaPresentacionObra: row.idFormaPresentacionObra,
			idFormaCalculoObra: row.idFormaCalculoObra,
			sujetoDemolicion: row.sujetoDemolicion,
			generarSuperficie: row.generarSuperficie,
			tipoSuperficie: row.tipoSuperficie,
			descripcion: row.descripcion,
			valor: row.valor,
			alicuota: row.alicuota,
			metros: row.metros,
			montoPresupuestado: row.montoPresupuestado,
			montoCalculado: row.montoCalculado
		});
		const result = new ObraInmuebleDetalle(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ObraInmuebleDetalle) {
		const affectedCount = await ObraInmuebleDetalleModel.update({
			idObraInmueble: row.idObraInmueble,
			idTipoObra: row.idTipoObra,
			idDestinoObra: row.idDestinoObra,
			idFormaPresentacionObra: row.idFormaPresentacionObra,
			idFormaCalculoObra: row.idFormaCalculoObra,
			sujetoDemolicion: row.sujetoDemolicion,
			generarSuperficie: row.generarSuperficie,
			tipoSuperficie: row.tipoSuperficie,
			descripcion: row.descripcion,
			valor: row.valor,
			alicuota: row.alicuota,
			metros: row.metros,
			montoPresupuestado: row.montoPresupuestado,
			montoCalculado: row.montoCalculado
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ObraInmuebleDetalleModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ObraInmuebleDetalle(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObraInmuebleDetalleModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByObraInmueble(idObraInmueble: number) {
		const affectedCount = await ObraInmuebleDetalleModel.destroy({ where: { idObraInmueble: idObraInmueble } });
		const result = (affectedCount > 0) ? {idObraInmueble} : null;
		
		return result;
	}

}
