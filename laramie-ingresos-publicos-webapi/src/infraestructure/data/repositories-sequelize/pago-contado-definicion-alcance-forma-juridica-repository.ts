import IPagoContadoDefinicionAlcanceFormaJuridicaRepository from '../../../domain/repositories/pago-contado-definicion-alcance-forma-juridica-repository';
import PagoContadoDefinicionAlcanceFormaJuridicaModel from './models/pago-contado-definicion-alcance-forma-juridica-model';
import PagoContadoDefinicionAlcanceFormaJuridica from '../../../domain/entities/pago-contado-definicion-alcance-forma-juridica';
import PagoContadoDefinicionAlcanceFormaJuridicaState from '../../../domain/dto/pago-contado-definicion-alcance-forma-juridica-state';

export default class PagoContadoDefinicionAlcanceFormaJuridicaRepositorySequelize implements IPagoContadoDefinicionAlcanceFormaJuridicaRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceFormaJuridicaModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceFormaJuridica(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceFormaJuridicaModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceFormaJuridicaState(...row.getDataValues()));

		return result;
	}


	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceFormaJuridicaModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceFormaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceFormaJuridica) {
		const data = await PagoContadoDefinicionAlcanceFormaJuridicaModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idFormaJuridica: row.idFormaJuridica
		});
		const result = new PagoContadoDefinicionAlcanceFormaJuridica(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceFormaJuridica) {
		const affectedCount = await PagoContadoDefinicionAlcanceFormaJuridicaModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idFormaJuridica: row.idFormaJuridica
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceFormaJuridicaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceFormaJuridica(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceFormaJuridicaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceFormaJuridicaModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
