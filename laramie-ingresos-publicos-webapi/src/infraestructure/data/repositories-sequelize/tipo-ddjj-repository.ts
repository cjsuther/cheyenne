import ITipoDDJJRepository from '../../../domain/repositories/tipo-ddjj-repository';
import TipoDDJJModel from './models/tipo-ddjj-model';
import TipoDDJJ from '../../../domain/entities/tipo-ddjj';

export default class TipoDDJJRepositorySequelize implements ITipoDDJJRepository {

	constructor() {

	}

	async list() {
		const data = await TipoDDJJModel.findAll();
		const result = data.map((row) => new TipoDDJJ(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoDDJJModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoDDJJ(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoDDJJ) {
		const data = await TipoDDJJModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			automatico: row.automatico
		});
		const result = new TipoDDJJ(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoDDJJ) {
		const affectedCount = await TipoDDJJModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			automatico: row.automatico
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoDDJJModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoDDJJ(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoDDJJModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
