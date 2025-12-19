import { Sequelize } from 'sequelize';
import { getNamespace } from 'cls-hooked';
import ISubTasaRepository from '../../../domain/repositories/sub-tasa-repository';
import SubTasaModel from './models/sub-tasa-model';
import SubTasa from '../../../domain/entities/sub-tasa';
import SubTasaFilter from '../../../domain/dto/sub-tasa-filter';

export default class SubTasaRepositorySequelize implements ISubTasaRepository {

	constructor() {

	}

	async list() {
		const data = await SubTasaModel.findAll();
		const result = data.map((row) => new SubTasa(...row.getDataValues()));

		return result;
	}

	async listByFilter(subTasaFilter: SubTasaFilter) {
		const data = await SubTasaModel.findAll();
		let result = data.map((row) => new SubTasa(...row.getDataValues()));
        result = result.filter(f => (subTasaFilter.idTasa === 0 || f.idTasa === subTasaFilter.idTasa) &&
									(subTasaFilter.codigo.length === 0 || f.codigo === subTasaFilter.codigo) &&
									(subTasaFilter.descripcion.length === 0 || f.descripcion.toLocaleLowerCase().indexOf(subTasaFilter.descripcion.toLocaleLowerCase()) >= 0)
							  );
        return result;
    }

	async findById(id:number) {
		const data = await SubTasaModel.findOne({ where: { id: id } });
		const result = (data) ? new SubTasa(...data.getDataValues()) : null;

		return result;
	}

	async add(row:SubTasa) {
		const data = await SubTasaModel.create({
			idTasa: row.idTasa,
			codigo: row.codigo,
			descripcion: row.descripcion,
			impuestoNacional: row.impuestoNacional,
			impuestoProvincial: row.impuestoProvincial,
			ctasCtes: row.ctasCtes,
			timbradosExtras: row.timbradosExtras,
			descripcionReducida: row.descripcionReducida,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			rubroGenerico: row.rubroGenerico,
			liquidableCtaCte: row.liquidableCtaCte,
			liquidableDDJJ: row.liquidableDDJJ,
			actualizacion: row.actualizacion,
			accesorios: row.accesorios,
			internetDDJJ: row.internetDDJJ,
			imputXPorc: row.imputXPorc
		});
		const result = new SubTasa(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:SubTasa) {
		const affectedCount = await SubTasaModel.update({
			idTasa: row.idTasa,
			codigo: row.codigo,
			descripcion: row.descripcion,
			impuestoNacional: row.impuestoNacional,
			impuestoProvincial: row.impuestoProvincial,
			ctasCtes: row.ctasCtes,
			timbradosExtras: row.timbradosExtras,
			descripcionReducida: row.descripcionReducida,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta,
			rubroGenerico: row.rubroGenerico,
			liquidableCtaCte: row.liquidableCtaCte,
			liquidableDDJJ: row.liquidableDDJJ,
			actualizacion: row.actualizacion,
			accesorios: row.accesorios,
			internetDDJJ: row.internetDDJJ,
			imputXPorc: row.imputXPorc
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await SubTasaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new SubTasa(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await SubTasaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async onTransaction(request) {
		const localStorage = getNamespace('LocalStorage');
		Sequelize.useCLS(localStorage);

		return await SubTasaModel.sequelize.transaction(async (t) => {
			return request();
		});
	}

}
