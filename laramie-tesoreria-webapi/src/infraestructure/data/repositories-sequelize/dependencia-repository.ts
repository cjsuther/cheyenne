import IDependenciaRepository from '../../../domain/repositories/dependencia-repository';
import DependenciaModel from './models/dependencia-model';
import Dependencia from '../../../domain/entities/dependencia';

export default class DependenciaRepositorySequelize implements IDependenciaRepository {

	constructor() {

	}

	async list() {
		const data = await DependenciaModel.findAll();
		const result = data.map((row) => new Dependencia(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DependenciaModel.findOne({ where: { id: id } });
		const result = (data) ? new Dependencia(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Dependencia) {
		const data = await DependenciaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new Dependencia(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Dependencia) {
		const affectedCount = await DependenciaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DependenciaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Dependencia(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DependenciaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
