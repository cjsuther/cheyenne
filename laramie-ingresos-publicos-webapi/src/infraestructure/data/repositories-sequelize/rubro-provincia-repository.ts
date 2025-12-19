import IRubroProvinciaRepository from '../../../domain/repositories/rubro-provincia-repository';
import RubroProvinciaModel from './models/rubro-provincia-model';
import RubroProvincia from '../../../domain/entities/rubro-provincia';

export default class RubroProvinciaRepositorySequelize implements IRubroProvinciaRepository {

	constructor() {

	}

	async list() {
		const data = await RubroProvinciaModel.findAll();
		const result = data.map((row) => new RubroProvincia(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RubroProvinciaModel.findOne({ where: { id: id } });
		const result = (data) ? new RubroProvincia(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RubroProvincia) {
		const data = await RubroProvinciaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new RubroProvincia(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RubroProvincia) {
		const affectedCount = await RubroProvinciaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RubroProvinciaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RubroProvincia(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RubroProvinciaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
