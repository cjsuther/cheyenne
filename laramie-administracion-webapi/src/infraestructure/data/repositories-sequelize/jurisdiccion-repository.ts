import IJurisdiccionRepository from '../../../domain/repositories/jurisdiccion-repository';
import JurisdiccionModel from './models/jurisdiccion-model';
import Jurisdiccion from '../../../domain/entities/jurisdiccion';

export default class JurisdiccionRepositorySequelize implements IJurisdiccionRepository {

	constructor() {

	}

	async list() {
		const data = await JurisdiccionModel.findAll();
		const result = data.map((row) => new Jurisdiccion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await JurisdiccionModel.findOne({ where: { id: id } });
		const result = (data) ? new Jurisdiccion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Jurisdiccion) {
		const data = await JurisdiccionModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			ejercicio: row.ejercicio,
			agrupamiento: row.agrupamiento,
			fecha: row.fecha,
			nivel: row.nivel,
			tipo: row.tipo
		});
		const result = new Jurisdiccion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Jurisdiccion) {
		const affectedCount = await JurisdiccionModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			ejercicio: row.ejercicio,
			agrupamiento: row.agrupamiento,
			fecha: row.fecha,
			nivel: row.nivel,
			tipo: row.tipo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await JurisdiccionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Jurisdiccion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await JurisdiccionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
