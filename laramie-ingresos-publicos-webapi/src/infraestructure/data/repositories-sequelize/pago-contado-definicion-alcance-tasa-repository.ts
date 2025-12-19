import IPagoContadoDefinicionAlcanceTasaRepository from '../../../domain/repositories/pago-contado-definicion-alcance-tasa-repository';
import PagoContadoDefinicionAlcanceTasaModel from './models/pago-contado-definicion-alcance-tasa-model';
import PagoContadoDefinicionAlcanceTasa from '../../../domain/entities/pago-contado-definicion-alcance-tasa';
import PagoContadoDefinicionAlcanceTasaState from '../../../domain/dto/pago-contado-definicion-alcance-tasa-state';

export default class PagoContadoDefinicionAlcanceTasaRepositorySequelize implements IPagoContadoDefinicionAlcanceTasaRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceTasaModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceTasa(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceTasaModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceTasaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceTasaModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceTasa(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceTasa) {
		const data = await PagoContadoDefinicionAlcanceTasaModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa
		});
		const result = new PagoContadoDefinicionAlcanceTasa(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceTasa) {
		const affectedCount = await PagoContadoDefinicionAlcanceTasaModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceTasaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceTasa(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceTasaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceTasaModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
