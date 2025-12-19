import IEscribanoRepository from '../../../domain/repositories/escribano-repository';
import EscribanoModel from './models/escribano-model';
import Escribano from '../../../domain/entities/escribano';

export default class EscribanoRepositorySequelize implements IEscribanoRepository {

	constructor() {

	}

	async list() {
		const data = await EscribanoModel.findAll();
		const result = data.map((row) => new Escribano(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EscribanoModel.findOne({ where: { id: id } });
		const result = (data) ? new Escribano(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Escribano) {
		const data = await EscribanoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			matricula: row.matricula
		});
		const result = new Escribano(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Escribano) {
		const affectedCount = await EscribanoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			matricula: row.matricula
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EscribanoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Escribano(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EscribanoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
