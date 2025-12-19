import IConfiguracionRepository from '../../../domain/repositories/configuracion-repository';
import ConfiguracionModel from './models/configuracion-model';
import Configuracion from '../../../domain/entities/configuracion';

export default class ConfiguracionRepositorySequelize implements IConfiguracionRepository {

	constructor() {

	}

	async list() {
		const data = await ConfiguracionModel.findAll();
		const result = data.map((row) => new Configuracion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ConfiguracionModel.findOne({ where: { id: id } });
		const result = (data) ? new Configuracion(...data.getDataValues()) : null;

		return result;
	}

	async findByNombre(nombre:string) {
		const data = await ConfiguracionModel.findOne({ where: { nombre: nombre } });
		const result = (data) ? new Configuracion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Configuracion) {
		const data = await ConfiguracionModel.create({
			nombre: row.nombre,
			valor: row.valor
		});
		const result = new Configuracion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Configuracion) {
		const affectedCount = await ConfiguracionModel.update({
			nombre: row.nombre,
			valor: row.valor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ConfiguracionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Configuracion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ConfiguracionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
