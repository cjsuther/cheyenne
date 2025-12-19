import IRegistroCivilRepository from '../../../domain/repositories/registro-civil-repository';
import RegistroCivilModel from './models/registro-civil-model';
import RegistroCivil from '../../../domain/entities/registro-civil';

export default class RegistroCivilRepositorySequelize implements IRegistroCivilRepository {

	constructor() {

	}

	async list() {
		const data = await RegistroCivilModel.findAll();
		const result = data.map((row) => new RegistroCivil(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RegistroCivilModel.findOne({ where: { id: id } });
		const result = (data) ? new RegistroCivil(...data.getDataValues()) : null;

		return result;
	}

	async add(row:RegistroCivil) {
		const data = await RegistroCivilModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new RegistroCivil(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:RegistroCivil) {
		const affectedCount = await RegistroCivilModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RegistroCivilModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new RegistroCivil(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RegistroCivilModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
