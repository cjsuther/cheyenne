import ITipoControladorRepository from '../../../domain/repositories/tipo-controlador-repository';
import TipoControladorModel from './models/tipo-controlador-model';
import TipoControlador from '../../../domain/entities/tipo-controlador';

export default class TipoControladorRepositorySequelize implements ITipoControladorRepository {

	constructor() {

	}

	async list() {
		const data = await TipoControladorModel.findAll();
		const result = data.map((row) => new TipoControlador(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await TipoControladorModel.findOne({ where: { id: id } });
		const result = (data) ? new TipoControlador(...data.getDataValues()) : null;

		return result;
	}

	async add(row:TipoControlador) {
		const data = await TipoControladorModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			esSupervisor: row.esSupervisor,
			email: row.email,
			direccion: row.direccion,
			abogado: row.abogado,
			oficialJusticia: row.oficialJusticia
		});
		const result = new TipoControlador(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:TipoControlador) {
		const affectedCount = await TipoControladorModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			esSupervisor: row.esSupervisor,
			email: row.email,
			direccion: row.direccion,
			abogado: row.abogado,
			oficialJusticia: row.oficialJusticia
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await TipoControladorModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new TipoControlador(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await TipoControladorModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
