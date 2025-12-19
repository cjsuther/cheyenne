import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import IReciboPublicacionLoteRepository from '../../../domain/repositories/recibo-publicacion-lote-repository';
import ReciboPublicacionLoteModel from './models/recibo-publicacion-lote-model';
import ReciboPublicacionLote from '../../../domain/entities/recibo-publicacion-lote';

export default class ReciboPublicacionLoteRepositorySequelize implements IReciboPublicacionLoteRepository {

	constructor() {

	}

	async list() {
		const data = await ReciboPublicacionLoteModel.findAll();
		const result = data.map((row) => new ReciboPublicacionLote(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ReciboPublicacionLoteModel.findOne({ where: { id: id } });
		const result = (data) ? new ReciboPublicacionLote(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ReciboPublicacionLote) {
		const data = await ReciboPublicacionLoteModel.create({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal1: row.importeTotal1,
			importeTotal2: row.importeTotal2
		});
		const result = new ReciboPublicacionLote(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ReciboPublicacionLote) {
		const affectedCount = await ReciboPublicacionLoteModel.update({
			numeroLote: row.numeroLote,
			fechaLote: row.fechaLote,
			casos: row.casos,
			importeTotal1: row.importeTotal1,
			importeTotal2: row.importeTotal2
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ReciboPublicacionLoteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ReciboPublicacionLote(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ReciboPublicacionLoteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await ReciboPublicacionLoteModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
