import ICocheriaRepository from '../../../domain/repositories/cocheria-repository';
import CocheriaModel from './models/cocheria-model';
import Cocheria from '../../../domain/entities/cocheria';

export default class CocheriaRepositorySequelize implements ICocheriaRepository {

	constructor() {

	}

	async list() {
		const data = await CocheriaModel.findAll();
		const result = data.map((row) => new Cocheria(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CocheriaModel.findOne({ where: { id: id } });
		const result = (data) ? new Cocheria(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Cocheria) {
		const data = await CocheriaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Cocheria(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Cocheria) {
		const affectedCount = await CocheriaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CocheriaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Cocheria(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CocheriaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
