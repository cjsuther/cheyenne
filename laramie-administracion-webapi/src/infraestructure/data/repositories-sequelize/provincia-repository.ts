import IProvinciaRepository from '../../../domain/repositories/provincia-repository';
import ProvinciaModel from './models/provincia-model';
import Provincia from '../../../domain/entities/provincia';

export default class ProvinciaRepositorySequelize implements IProvinciaRepository {

	constructor() {

	}

	async list() {
		const data = await ProvinciaModel.findAll();
		const result = data.map((row) => new Provincia(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ProvinciaModel.findOne({ where: { id: id } });
		const result = (data) ? new Provincia(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Provincia) {
		const data = await ProvinciaModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idPais: row.idPais
		});
		const result = new Provincia(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Provincia) {
		const affectedCount = await ProvinciaModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idPais: row.idPais
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ProvinciaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Provincia(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ProvinciaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
