import ITipoElementoRepository from '../../../domain/repositories/tipo-elemento-repository';
import TipoElementoModel from './models/tipo-elemento-model';
import TipoElemento from '../../../domain/entities/tipo-elemento';

export default class TipoElementoRepositorySequelize implements ITipoElementoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoElementoModel.findAll();
		const result = data.map((row) => new TipoElemento(...row.getDataValues()));

		return result;
	}

	async listByClaseElemento(idClaseElemento: number) {
		const data = await TipoElementoModel.findAll({where: { idClaseElemento: idClaseElemento }});
		const result = data.map((row) => new TipoElemento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoElementoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoElemento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoElemento) {
		const data = await TipoElementoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idClaseElemento: row.idClaseElemento,
			idUnidadMedida: row.idUnidadMedida,
			valor: row.valor
		});
		const result = new TipoElemento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoElemento) {
		const affectedCount = await TipoElementoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idClaseElemento: row.idClaseElemento,
			idUnidadMedida: row.idUnidadMedida,
			valor: row.valor
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoElementoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoElemento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoElementoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
