import IZonaTarifariaRepository from '../../../domain/repositories/zona-tarifaria-repository';
import ZonaTarifariaModel from './models/zona-tarifaria-model';
import ZonaTarifaria from '../../../domain/entities/zona-tarifaria';

export default class ZonaTarifariaRepositorySequelize implements IZonaTarifariaRepository {

	constructor() {

	}

	async list() {
		const data = await ZonaTarifariaModel.findAll();
		const result = data.map((row) => new ZonaTarifaria(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ZonaTarifariaModel.findOne({ where: { id: id } });
		const result = (data) ? new ZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ZonaTarifaria) {
		const data = await ZonaTarifariaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new ZonaTarifaria(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ZonaTarifaria) {
		const affectedCount = await ZonaTarifariaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ZonaTarifariaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ZonaTarifaria(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ZonaTarifariaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
