import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IPagoRendicionLoteRepository from '../../../domain/repositories/pago-rendicion-lote-repository';
import PagoRendicionLoteModel from './models/pago-rendicion-lote-model';
import PagoRendicionLote from '../../../domain/entities/pago-rendicion-lote';

export default class PagoRendicionLoteRepositorySequelize implements IPagoRendicionLoteRepository {

	constructor() {

	}

	async list() {
		const data = await PagoRendicionLoteModel.findAll();
		const result = data.map((row) => new PagoRendicionLote(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoRendicionLoteModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoRendicionLote(...data.getDataValues()) : null;

		return result;
	}

	async findByLote(numeroLote:string) {
		const data = await PagoRendicionLoteModel.findOne({ where: { numeroLote: numeroLote } });
		const result = (data) ? new PagoRendicionLote(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoRendicionLote) {
		const data = await PagoRendicionLoteModel.create({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal: row.importeTotal,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			fechaConfirmacion: row.fechaConfirmacion
		});
		const result = new PagoRendicionLote(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoRendicionLote) {
		const affectedCount = await PagoRendicionLoteModel.update({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal: row.importeTotal,
			idUsuarioProceso: row.idUsuarioProceso,
			fechaProceso: row.fechaProceso,
			fechaConfirmacion: row.fechaConfirmacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoRendicionLoteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoRendicionLote(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoRendicionLoteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await PagoRendicionLoteModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
