import ITipoInstrumentoRepository from '../../../domain/repositories/tipo-instrumento-repository';
import TipoInstrumentoModel from './models/tipo-instrumento-model';
import TipoInstrumento from '../../../domain/entities/tipo-instrumento';

export default class TipoInstrumentoRepositorySequelize implements ITipoInstrumentoRepository {

	constructor() {

	}

	async list() {
		const data = await TipoInstrumentoModel.findAll();
		const result = data.map((row) => new TipoInstrumento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoInstrumentoModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoInstrumento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoInstrumento) {
		const data = await TipoInstrumentoModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		});
		const result = new TipoInstrumento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoInstrumento) {
		const affectedCount = await TipoInstrumentoModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoInstrumentoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoInstrumento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoInstrumentoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
