import ILadoTerrenoObraRepository from '../../../domain/repositories/lado-terreno-obra-repository';
import LadoTerrenoObraModel from './models/lado-terreno-obra-model';
import LadoTerrenoObra from '../../../domain/entities/lado-terreno-obra';

export default class LadoTerrenoObraRepositorySequelize implements ILadoTerrenoObraRepository {

	constructor() {

	}

	async listByLadoTerreno(idLadoTerreno: number) {
		const data = await LadoTerrenoObraModel.findAll({ where: { idLadoTerreno: idLadoTerreno } });
		const result = data.map((row) => new LadoTerrenoObra(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await LadoTerrenoObraModel.findOne({ where: { id: id } });
		const result = (data) ? new LadoTerrenoObra(...data.getDataValues()) : null;

		return result;
	}

	async add(row:LadoTerrenoObra) {
		const data = await LadoTerrenoObraModel.create({
			idLadoTerreno: row.idLadoTerreno,
			idObra: row.idObra,
			importe: row.importe,
			reduccionMetros: row.reduccionMetros,
			reduccionSuperficie: row.reduccionSuperficie,
			fecha: row.fecha
		});
		const result = new LadoTerrenoObra(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:LadoTerrenoObra) {
		const affectedCount = await LadoTerrenoObraModel.update({
			idLadoTerreno: row.idLadoTerreno,
			idObra: row.idObra,
			importe: row.importe,
			reduccionMetros: row.reduccionMetros,
			reduccionSuperficie: row.reduccionSuperficie,
			fecha: row.fecha
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await LadoTerrenoObraModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new LadoTerrenoObra(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await LadoTerrenoObraModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByLadoTerreno(idLadoTerreno: number) {
		const affectedCount = await LadoTerrenoObraModel.destroy({ where: { idLadoTerreno: idLadoTerreno } });
		const result = (affectedCount > 0) ? {idLadoTerreno} : null;
		
		return result;
	}

}
