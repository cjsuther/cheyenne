import IPagoRendicionRepository from '../../../domain/repositories/pago-rendicion-repository';
import PagoRendicionModel from './models/pago-rendicion-model';
import PagoRendicion from '../../../domain/entities/pago-rendicion';

export default class PagoRendicionRepositorySequelize implements IPagoRendicionRepository {

	constructor() {

	}

	async list() {
		const data = await PagoRendicionModel.findAll();
		const result = data.map((row) => new PagoRendicion(...row.getDataValues()));

		return result;
	}

	async listByLote(idPagoRendicionLote:number) {
		const data = await PagoRendicionModel.findAll({ where: { idPagoRendicionLote: idPagoRendicionLote } });
		const result = data.map((row) => new PagoRendicion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoRendicionModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoRendicion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoRendicion) {
		const data = await PagoRendicionModel.create({
			idPagoRendicionLote: row.idPagoRendicionLote,
			idCuentaPago: row.idCuentaPago,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			codigoLugarPago: row.codigoLugarPago,
			importePago: row.importePago,
			fechaPago: row.fechaPago,
			codigoBarras: row.codigoBarras
		});
		const result = new PagoRendicion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoRendicion) {
		const affectedCount = await PagoRendicionModel.update({
			idPagoRendicionLote: row.idPagoRendicionLote,
			idCuentaPago: row.idCuentaPago,
			codigoDelegacion: row.codigoDelegacion,
			numeroRecibo: row.numeroRecibo,
			codigoLugarPago: row.codigoLugarPago,
			importePago: row.importePago,
			fechaPago: row.fechaPago,
			codigoBarras: row.codigoBarras
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoRendicionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoRendicion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoRendicionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
