import IFiltroRepository from '../../../domain/repositories/filtro-repository';
import FiltroModel from './models/filtro-model';
import Filtro from '../../../domain/entities/filtro';

export default class FiltroRepositorySequelize implements IFiltroRepository {

	constructor() {

	}

	async list() {
		const data = await FiltroModel.findAll();
		const result = data.map((row) => new Filtro(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await FiltroModel.findOne({ where: { id: id } });
		const result = (data) ? new Filtro(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Filtro) {
		const data = await FiltroModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo,
			ejecucion: row.ejecucion
		});
		const result = new Filtro(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Filtro) {
		const affectedCount = await FiltroModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo,
			ejecucion: row.ejecucion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await FiltroModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Filtro(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await FiltroModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async execute(row:Filtro) {
        const cursor = await FiltroModel.sequelize.query(`SELECT * FROM ${row.ejecucion}();`);
        const data = cursor[0] as any;
       
        const result = data.map(item => item["id"]);

        return result;
    }

}
