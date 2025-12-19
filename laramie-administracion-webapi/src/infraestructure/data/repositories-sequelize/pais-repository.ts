import IPaisRepository from '../../../domain/repositories/pais-repository';
import PaisModel from './models/pais-model';
import Pais from '../../../domain/entities/pais';

export default class PaisRepositorySequelize implements IPaisRepository {

	constructor() {

	}

	async list() {
		const data = await PaisModel.findAll();
		const result = data.map((row) => new Pais(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PaisModel.findOne({ where: { id: id } });
		const result = (data) ? new Pais(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Pais) {
		const data = await PaisModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Pais(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Pais) {
		const affectedCount = await PaisModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PaisModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Pais(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PaisModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
