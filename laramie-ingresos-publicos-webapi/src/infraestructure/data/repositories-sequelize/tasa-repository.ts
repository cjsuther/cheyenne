import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ITasaRepository from '../../../domain/repositories/tasa-repository';
import TasaModel from './models/tasa-model';
import Tasa from '../../../domain/entities/tasa';
import TasaFilter from '../../../domain/dto/tasa-filter';

export default class TasaRepositorySequelize implements ITasaRepository {

	constructor() {

	}

	async list() {
		const data = await TasaModel.findAll();
		const result = data.map((row) => new Tasa(...row.getDataValues()));

		return result;
	}

	async listByFilter(tasaFilter: TasaFilter) {
		const data = await TasaModel.findAll();
		let result = data.map((row) => new Tasa(...row.getDataValues()));
        result = result.filter(f => (tasaFilter.codigo.length === 0 || f.codigo === tasaFilter.codigo) &&
									(tasaFilter.descripcion.length === 0 || f.descripcion.toLocaleLowerCase().indexOf(tasaFilter.descripcion.toLocaleLowerCase()) >= 0)
							  );
        return result;
    }

	async findById(id:number) {
		const data = await TasaModel.findOne({ where: { id: id } });
		const result = (data) ? new Tasa(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Tasa) {
		const data = await TasaModel.create({
			codigo: row.codigo,
			idTipoTributo: row.idTipoTributo,
			idCategoriaTasa: row.idCategoriaTasa,
			descripcion: row.descripcion,
			porcentajeDescuento: row.porcentajeDescuento
		});
		const result = new Tasa(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Tasa) {
		const affectedCount = await TasaModel.update({
			codigo: row.codigo,
			idTipoTributo: row.idTipoTributo,
			idCategoriaTasa: row.idCategoriaTasa,
			descripcion: row.descripcion,
			porcentajeDescuento: row.porcentajeDescuento
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TasaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Tasa(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TasaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await TasaModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
