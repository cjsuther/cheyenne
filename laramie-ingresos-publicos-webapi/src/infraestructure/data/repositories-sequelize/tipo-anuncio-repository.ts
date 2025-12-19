import ITipoAnuncioRepository from '../../../domain/repositories/tipo-anuncio-repository';
import TipoAnuncioModel from './models/tipo-anuncio-model';
import TipoAnuncio from '../../../domain/entities/tipo-anuncio';

export default class TipoAnuncioRepositorySequelize implements ITipoAnuncioRepository {

	constructor() {

	}

	async list() {
		const data = await TipoAnuncioModel.findAll();
		const result = data.map((row) => new TipoAnuncio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoAnuncioModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoAnuncio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoAnuncio) {
		const data = await TipoAnuncioModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			porcentaje: row.porcentaje,
			importe: row.importe
		});
		const result = new TipoAnuncio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoAnuncio) {
		const affectedCount = await TipoAnuncioModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			porcentaje: row.porcentaje,
			importe: row.importe
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoAnuncioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoAnuncio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoAnuncioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
