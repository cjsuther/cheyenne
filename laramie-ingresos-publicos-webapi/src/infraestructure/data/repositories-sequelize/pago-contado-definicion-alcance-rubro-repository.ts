import IPagoContadoDefinicionAlcanceRubroRepository from '../../../domain/repositories/pago-contado-definicion-alcance-rubro-repository';
import PagoContadoDefinicionAlcanceRubroModel from './models/pago-contado-definicion-alcance-rubro-model';
import PagoContadoDefinicionAlcanceRubro from '../../../domain/entities/pago-contado-definicion-alcance-rubro';
import PagoContadoDefinicionAlcanceRubroState from '../../../domain/dto/pago-contado-definicion-alcance-rubro-state';

export default class PagoContadoDefinicionAlcanceRubroRepositorySequelize implements IPagoContadoDefinicionAlcanceRubroRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceRubroModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceRubro(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceRubroModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceRubroState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceRubroModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceRubro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceRubro) {
		const data = await PagoContadoDefinicionAlcanceRubroModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idRubro: row.idRubro
		});
		const result = new PagoContadoDefinicionAlcanceRubro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceRubro) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idRubro: row.idRubro
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceRubroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceRubro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceRubroModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
