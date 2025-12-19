import IObraRepository from '../../../domain/repositories/obra-repository';
import ObraModel from './models/obra-model';
import Obra from '../../../domain/entities/obra';

export default class ObraRepositorySequelize implements IObraRepository {

	constructor() {

	}

	async list() {
		const data = await ObraModel.findAll();
		const result = data.map((row) => new Obra(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ObraModel.findOne({ where: { id: id } });
		const result = (data) ? new Obra(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Obra) {
		const data = await ObraModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			importe: row.importe
		});
		const result = new Obra(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Obra) {
		const affectedCount = await ObraModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			importe: row.importe
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ObraModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Obra(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ObraModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
