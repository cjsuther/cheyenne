import IRubroBCRARepository from '../../../domain/repositories/rubro-bcra-repository';
import RubroBCRAModel from './models/rubro-bcra-model';
import RubroBCRA from '../../../domain/entities/rubro-bcra';

export default class RubroBCRARepositorySequelize implements IRubroBCRARepository {

	constructor() {

	}

	async list() {
		const data = await RubroBCRAModel.findAll();
		const result = data.map((row) => new RubroBCRA(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RubroBCRAModel.findOne({ where: { id: id } });
		const result = (data) ? new RubroBCRA(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RubroBCRA) {
		const data = await RubroBCRAModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new RubroBCRA(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RubroBCRA) {
		const affectedCount = await RubroBCRAModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RubroBCRAModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RubroBCRA(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RubroBCRAModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
