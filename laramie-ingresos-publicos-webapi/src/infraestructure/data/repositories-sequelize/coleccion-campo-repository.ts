import IColeccionCampoRepository from '../../../domain/repositories/coleccion-campo-repository';
import ColeccionCampoModel from './models/coleccion-campo-model';
import ColeccionCampo from '../../../domain/entities/coleccion-campo';

export default class ColeccionCampoRepositorySequelize implements IColeccionCampoRepository {

	constructor() {

	}

	async listByColeccion(idColeccion: number) {
		const data = await ColeccionCampoModel.findAll({ where: { idColeccion: idColeccion } });
		const result = data.map((row) => new ColeccionCampo(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ColeccionCampoModel.findOne({ where: { id: id } });
		const result = (data) ? new ColeccionCampo(...data.getDataValues()) : null;

		return result;
	}

	async add(row:ColeccionCampo) {
		const data = await ColeccionCampoModel.create({
			idColeccion: row.idColeccion,
			idTipoVariable: row.idTipoVariable,
			campo: row.campo,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		});
		const result = new ColeccionCampo(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:ColeccionCampo) {
		const affectedCount = await ColeccionCampoModel.update({
			idColeccion: row.idColeccion,
			idTipoVariable: row.idTipoVariable,
			campo: row.campo,
			codigo: row.codigo,
			nombre: row.nombre,
			tipoDato: row.tipoDato,
			orden: row.orden
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ColeccionCampoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new ColeccionCampo(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ColeccionCampoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
