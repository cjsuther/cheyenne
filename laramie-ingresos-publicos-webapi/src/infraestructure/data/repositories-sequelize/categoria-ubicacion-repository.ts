import ICategoriaUbicacionRepository from '../../../domain/repositories/categoria-ubicacion-repository';
import CategoriaUbicacionModel from './models/categoria-ubicacion-model';
import CategoriaUbicacion from '../../../domain/entities/categoria-ubicacion';

export default class CategoriaUbicacionRepositorySequelize implements ICategoriaUbicacionRepository {

	constructor() {

	}

	async list() {
		const data = await CategoriaUbicacionModel.findAll();
		const result = data.map((row) => new CategoriaUbicacion(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CategoriaUbicacionModel.findOne({ where: { id: id } });
		const result = (data) ? new CategoriaUbicacion(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CategoriaUbicacion) {
		const data = await CategoriaUbicacionModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			coeficiente: row.coeficiente
		});
		const result = new CategoriaUbicacion(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CategoriaUbicacion) {
		const affectedCount = await CategoriaUbicacionModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			coeficiente: row.coeficiente
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CategoriaUbicacionModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CategoriaUbicacion(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CategoriaUbicacionModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
