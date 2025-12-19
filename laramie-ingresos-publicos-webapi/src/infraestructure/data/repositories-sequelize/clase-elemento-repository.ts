import IClaseElementoRepository from '../../../domain/repositories/clase-elemento-repository';
import ClaseElementoModel from './models/clase-elemento-model';
import ClaseElemento from '../../../domain/entities/clase-elemento';

export default class ClaseElementoRepositorySequelize implements IClaseElementoRepository {

	constructor() {

	}

	async list() {
		const data = await ClaseElementoModel.findAll();
		const result = data.map((row) => new ClaseElemento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ClaseElementoModel.findOne({ where: { id: id } });
		const result = (data) ? new ClaseElemento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ClaseElemento) {
		const data = await ClaseElementoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo
		});
		const result = new ClaseElemento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ClaseElemento) {
		const affectedCount = await ClaseElementoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ClaseElementoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ClaseElemento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ClaseElementoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
