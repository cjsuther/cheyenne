import IZonaGeoreferenciaRepository from '../../../domain/repositories/zona-georeferencia-repository';
import ZonaGeoreferenciaModel from './models/zona-georeferencia-model';
import ZonaGeoreferencia from '../../../domain/entities/zona-georeferencia';

export default class ZonaGeoreferenciaRepositorySequelize implements IZonaGeoreferenciaRepository {

	constructor() {

	}

	async list() {
		const data = await ZonaGeoreferenciaModel.findAll();
		const result = data.map((row) => new ZonaGeoreferencia(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ZonaGeoreferenciaModel.findOne({ where: { id: id } });
		const result = (data) ? new ZonaGeoreferencia(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ZonaGeoreferencia) {
		const data = await ZonaGeoreferenciaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idLocalidad: row.idLocalidad,
			longitud: row.longitud,
			latitud: row.latitud
		});
		const result = new ZonaGeoreferencia(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ZonaGeoreferencia) {
		const affectedCount = await ZonaGeoreferenciaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idLocalidad: row.idLocalidad,
			longitud: row.longitud,
			latitud: row.latitud
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ZonaGeoreferenciaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ZonaGeoreferencia(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ZonaGeoreferenciaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
