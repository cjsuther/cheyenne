import ILadoTerrenoServicioRepository from '../../../domain/repositories/lado-terreno-servicio-repository';
import LadoTerrenoServicioModel from './models/lado-terreno-servicio-model';
import LadoTerrenoServicio from '../../../domain/entities/lado-terreno-servicio';

export default class LadoTerrenoServicioRepositorySequelize implements ILadoTerrenoServicioRepository {

	constructor() {

	}

	async listByLadoTerreno(idLadoTerreno: number) {
		const data = await LadoTerrenoServicioModel.findAll({ where: { idLadoTerreno: idLadoTerreno } });
		const result = data.map((row) => new LadoTerrenoServicio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await LadoTerrenoServicioModel.findOne({ where: { id: id } });
		const result = (data) ? new LadoTerrenoServicio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:LadoTerrenoServicio) {
		const data = await LadoTerrenoServicioModel.create({
			idLadoTerreno: row.idLadoTerreno,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new LadoTerrenoServicio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:LadoTerrenoServicio) {
		const affectedCount = await LadoTerrenoServicioModel.update({
			idLadoTerreno: row.idLadoTerreno,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await LadoTerrenoServicioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new LadoTerrenoServicio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await LadoTerrenoServicioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByLadoTerreno(idLadoTerreno: number) {
		const affectedCount = await LadoTerrenoServicioModel.destroy({ where: { idLadoTerreno: idLadoTerreno } });
		const result = (affectedCount > 0) ? {idLadoTerreno} : null;
		
		return result;
	}


}
