import IConvenioParametroRepository from '../../../domain/repositories/convenio-parametro-repository';
import ConvenioParametroModel from './models/convenio-parametro-model';
import ConvenioParametro from '../../../domain/entities/convenio-parametro';

export default class ConvenioParametroRepositorySequelize implements IConvenioParametroRepository {

	constructor() {

	}

	async list() {
		const data = await ConvenioParametroModel.findAll();
		const result = data.map((row) => new ConvenioParametro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ConvenioParametroModel.findOne({ where: { id: id } });
		const result = (data) ? new ConvenioParametro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ConvenioParametro) {
		const data = await ConvenioParametroModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new ConvenioParametro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ConvenioParametro) {
		const affectedCount = await ConvenioParametroModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ConvenioParametroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ConvenioParametro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ConvenioParametroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
