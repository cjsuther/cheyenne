import IActoProcesalRepository from '../../../domain/repositories/acto-procesal-repository';
import ActoProcesalModel from './models/acto-procesal-model';
import ActoProcesal from '../../../domain/entities/acto-procesal';
import ActoProcesalState from '../../../domain/dto/acto-procesal-state';

export default class ActoProcesalRepositorySequelize implements IActoProcesalRepository {

	constructor() {

	}

	async listByApremio(idApremio: number) {
		const data = await ActoProcesalModel.findAll({where: { idApremio: idApremio }});
		const result = data.map((row) => new ActoProcesalState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ActoProcesalModel.findOne({ where: { id: id } });
		const result = (data) ? new ActoProcesal(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ActoProcesal) {
		const data = await ActoProcesalModel.create({
			idApremio: row.idApremio,
			idTipoActoProcesal: row.idTipoActoProcesal,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			observacion: row.observacion
		});
		const result = new ActoProcesal(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ActoProcesal) {
		const affectedCount = await ActoProcesalModel.update({
			idApremio: row.idApremio,
			idTipoActoProcesal: row.idTipoActoProcesal,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ActoProcesalModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ActoProcesal(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ActoProcesalModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByApremio(idApremio: number) {
		const affectedCount = await ActoProcesalModel.destroy({ where: { idApremio: idApremio } });
		const result = (affectedCount > 0) ? {idApremio} : null;

		return result;
	}

}
