import IRubroRepository from '../../../domain/repositories/rubro-repository';
import RubroModel from './models/rubro-model';
import Rubro from '../../../domain/entities/rubro';

export default class RubroRepositorySequelize implements IRubroRepository {

	constructor() {

	}

	async list() {
		const data = await RubroModel.findAll();
		const result = data.map((row) => new Rubro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RubroModel.findOne({ where: { id: id } });
		const result = (data) ? new Rubro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Rubro) {
		const data = await RubroModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Rubro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Rubro) {
		const affectedCount = await RubroModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RubroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Rubro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RubroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
