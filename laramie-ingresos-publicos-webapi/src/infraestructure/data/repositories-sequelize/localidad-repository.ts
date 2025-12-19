import ILocalidadRepository from '../../../domain/repositories/localidad-repository';
import LocalidadModel from './models/localidad-model';
import Localidad from '../../../domain/entities/localidad';

export default class LocalidadRepositorySequelize implements ILocalidadRepository {

	constructor() {

	}

	async list() {
		const data = await LocalidadModel.findAll();
		const result = data.map((row) => new Localidad(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await LocalidadModel.findOne({ where: { id: id } });
		const result = (data) ? new Localidad(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Localidad) {
		const data = await LocalidadModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idProvincia: row.idProvincia
		});
		const result = new Localidad(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Localidad) {
		const affectedCount = await LocalidadModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idProvincia: row.idProvincia
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await LocalidadModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Localidad(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await LocalidadModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
