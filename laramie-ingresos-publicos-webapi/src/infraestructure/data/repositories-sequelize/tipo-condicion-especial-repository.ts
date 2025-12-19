import ITipoCondicionEspecialRepository from '../../../domain/repositories/tipo-condicion-especial-repository';
import TipoCondicionEspecialModel from './models/tipo-condicion-especial-model';
import TipoCondicionEspecial from '../../../domain/entities/tipo-condicion-especial';

export default class TipoCondicionEspecialRepositorySequelize implements ITipoCondicionEspecialRepository {

	constructor() {

	}

	async list() {
		const data = await TipoCondicionEspecialModel.findAll();
		const result = data.map((row) => new TipoCondicionEspecial(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoCondicionEspecialModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoCondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigo(codigo:string) {
		const data = await TipoCondicionEspecialModel.findOne({ where: { codigo: codigo } });
		const result = (data) ? new TipoCondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoCondicionEspecial) {
		const data = await TipoCondicionEspecialModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo,
			tipo: row.tipo,
			color: row.color,
			inhibicion: row.inhibicion
		});
		const result = new TipoCondicionEspecial(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoCondicionEspecial) {
		const affectedCount = await TipoCondicionEspecialModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			idTipoTributo: row.idTipoTributo,
			tipo: row.tipo,
			color: row.color,
			inhibicion: row.inhibicion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoCondicionEspecialModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoCondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoCondicionEspecialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
