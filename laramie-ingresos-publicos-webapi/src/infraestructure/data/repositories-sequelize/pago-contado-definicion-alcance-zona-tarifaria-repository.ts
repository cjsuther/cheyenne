import IPagoContadoDefinicionAlcanceZonaTarifariaRepository from '../../../domain/repositories/pago-contado-definicion-alcance-zona-tarifaria-repository';
import PagoContadoDefinicionAlcanceZonaTarifariaModel from './models/pago-contado-definicion-alcance-zona-tarifaria-model';
import PagoContadoDefinicionAlcanceZonaTarifaria from '../../../domain/entities/pago-contado-definicion-alcance-zona-tarifaria';
import PagoContadoDefinicionAlcanceZonaTarifariaState from '../../../domain/dto/pago-contado-definicion-alcance-zona-tarifaria-state';

export default class PagoContadoDefinicionAlcanceZonaTarifariaRepositorySequelize implements IPagoContadoDefinicionAlcanceZonaTarifariaRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionAlcanceZonaTarifariaModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionAlcanceZonaTarifaria(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionAlcanceZonaTarifariaModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionAlcanceZonaTarifariaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionAlcanceZonaTarifariaModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionAlcanceZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionAlcanceZonaTarifaria) {
		const data = await PagoContadoDefinicionAlcanceZonaTarifariaModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idZonaTarifaria: row.idZonaTarifaria
		});
		const result = new PagoContadoDefinicionAlcanceZonaTarifaria(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionAlcanceZonaTarifaria) {
		const affectedCount = await PagoContadoDefinicionAlcanceZonaTarifariaModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idZonaTarifaria: row.idZonaTarifaria
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionAlcanceZonaTarifariaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionAlcanceZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceZonaTarifariaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionAlcanceZonaTarifariaModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
