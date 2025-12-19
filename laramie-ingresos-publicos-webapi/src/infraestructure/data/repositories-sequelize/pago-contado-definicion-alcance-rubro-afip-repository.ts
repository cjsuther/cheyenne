import IPagoContadoDefinicionAlcanceRubroAfipRepository from '../../../domain/repositories/pago-contado-definicion-alcance-rubro-afip-repository';
import PagoContadoDefinicionAlcanceRubroAfipModel from './models/pago-contado-definicion-alcance-rubro-afip-model';
import PagoContadoDefinicionAlcanceRubroAfip from '../../../domain/entities/pago-contado-definicion-alcance-rubro-afip';
import PagoContadoDefinicionAlcanceRubroAfipState from '../../../domain/dto/pago-contado-definicion-alcance-rubro-afip-state';

export default class PagoContadoDefinicionAlcanceRubroAfipRepositorySequelize implements IPagoContadoDefinicionAlcanceRubroAfipRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceRubroAfipModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceRubroAfip(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceRubroAfipModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceRubroAfipState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceRubroAfipModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceRubroAfip(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceRubroAfip) {
		const data = await PagoContadoDefinicionAlcanceRubroAfipModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idRubroAfip: row.idRubroAfip
		});
		const result = new PagoContadoDefinicionAlcanceRubroAfip(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceRubroAfip) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroAfipModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idRubroAfip: row.idRubroAfip
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceRubroAfipModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceRubroAfip(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroAfipModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroAfipModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
