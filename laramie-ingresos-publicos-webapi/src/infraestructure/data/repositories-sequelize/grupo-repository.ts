import IGrupoRepository from '../../../domain/repositories/grupo-repository';
import GrupoModel from './models/grupo-model';
import Grupo from '../../../domain/entities/grupo';

export default class GrupoRepositorySequelize implements IGrupoRepository {

	constructor() {

	}

	async list() {
		const data = await GrupoModel.findAll();
		const result = data.map((row) => new Grupo(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await GrupoModel.findOne({ where: { id: id } });
		const result = (data) ? new Grupo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Grupo) {
		const data = await GrupoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Grupo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Grupo) {
		const affectedCount = await GrupoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await GrupoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Grupo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await GrupoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
