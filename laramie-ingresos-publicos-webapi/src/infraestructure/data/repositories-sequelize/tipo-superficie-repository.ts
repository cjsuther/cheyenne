import ITipoSuperficieRepository from '../../../domain/repositories/tipo-superficie-repository';
import TipoSuperficieModel from './models/tipo-superficie-model';
import TipoSuperficie from '../../../domain/entities/tipo-superficie';

export default class TipoSuperficieRepositorySequelize implements ITipoSuperficieRepository {

	constructor() {

	}

	async list() {
		const data = await TipoSuperficieModel.findAll();
		const result = data.map((row) => new TipoSuperficie(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoSuperficieModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoSuperficie(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoSuperficie) {
		const data = await TipoSuperficieModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			clase: row.clase,
			suma: row.suma,
			adicionales: row.adicionales
		});
		const result = new TipoSuperficie(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoSuperficie) {
		const affectedCount = await TipoSuperficieModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			clase: row.clase,
			suma: row.suma,
			adicionales: row.adicionales
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoSuperficieModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoSuperficie(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoSuperficieModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
