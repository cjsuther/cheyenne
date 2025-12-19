import IPagoContadoDefinicionAlcanceGrupoRepository from '../../../domain/repositories/pago-contado-definicion-alcance-grupo-repository';
import PagoContadoDefinicionAlcanceGrupoModel from './models/pago-contado-definicion-alcance-grupo-model';
import PagoContadoDefinicionAlcanceGrupo from '../../../domain/entities/pago-contado-definicion-alcance-grupo';
import PagoContadoDefinicionAlcanceGrupoState from '../../../domain/dto/pago-contado-definicion-alcance-grupo-state';

export default class PagoContadoDefinicionAlcanceGrupoRepositorySequelize implements IPagoContadoDefinicionAlcanceGrupoRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceGrupoModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceGrupo(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceGrupoModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceGrupoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceGrupoModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceGrupo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceGrupo) {
		const data = await PagoContadoDefinicionAlcanceGrupoModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idGrupo: row.idGrupo
		});
		const result = new PagoContadoDefinicionAlcanceGrupo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceGrupo) {
		const affectedCount = await PagoContadoDefinicionAlcanceGrupoModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idGrupo: row.idGrupo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceGrupoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceGrupo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceGrupoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceGrupoModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}
}
