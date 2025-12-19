import IGrupoSuperficieRepository from '../../../domain/repositories/grupo-superficie-repository';
import GrupoSuperficieModel from './models/grupo-superficie-model';
import GrupoSuperficie from '../../../domain/entities/grupo-superficie';

export default class GrupoSuperficieRepositorySequelize implements IGrupoSuperficieRepository {

	constructor() {

	}

	async list() {
		const data = await GrupoSuperficieModel.findAll();
		const result = data.map((row) => new GrupoSuperficie(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await GrupoSuperficieModel.findOne({ where: { id: id } });
		const result = (data) ? new GrupoSuperficie(...data.getDataValues()) : null;

		return result;
	}

	async add(row:GrupoSuperficie) {
		const data = await GrupoSuperficieModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new GrupoSuperficie(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:GrupoSuperficie) {
		const affectedCount = await GrupoSuperficieModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await GrupoSuperficieModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new GrupoSuperficie(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await GrupoSuperficieModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
