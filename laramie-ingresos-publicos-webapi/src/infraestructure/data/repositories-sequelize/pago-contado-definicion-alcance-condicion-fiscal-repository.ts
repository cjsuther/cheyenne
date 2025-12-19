import IPagoContadoDefinicionAlcanceCondicionFiscalRepository from '../../../domain/repositories/pago-contado-definicion-alcance-condicion-fiscal-repository';
import PagoContadoDefinicionAlcanceCondicionFiscalModel from './models/pago-contado-definicion-alcance-condicion-fiscal-model';
import PagoContadoDefinicionAlcanceCondicionFiscal from '../../../domain/entities/pago-contado-definicion-alcance-condicion-fiscal';
import PagoContadoDefinicionAlcanceCondicionFiscalState from '../../../domain/dto/pago-contado-definicion-alcance-condicion-fiscal-state';

export default class PagoContadoDefinicionAlcanceCondicionFiscalRepositorySequelize implements IPagoContadoDefinicionAlcanceCondicionFiscalRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceCondicionFiscalModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceCondicionFiscal(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceCondicionFiscalModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceCondicionFiscalState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceCondicionFiscalModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceCondicionFiscal(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceCondicionFiscal) {
		const data = await PagoContadoDefinicionAlcanceCondicionFiscalModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idCondicionFiscal: row.idCondicionFiscal
		});
		const result = new PagoContadoDefinicionAlcanceCondicionFiscal(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceCondicionFiscal) {
		const affectedCount = await PagoContadoDefinicionAlcanceCondicionFiscalModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idCondicionFiscal: row.idCondicionFiscal
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceCondicionFiscalModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceCondicionFiscal(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceCondicionFiscalModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceCondicionFiscalModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
