import IUbicacionComercioRepository from '../../../domain/repositories/ubicacion-comercio-repository';
import UbicacionComercioModel from './models/ubicacion-comercio-model';
import UbicacionComercio from '../../../domain/entities/ubicacion-comercio';

export default class UbicacionComercioRepositorySequelize implements IUbicacionComercioRepository {

	constructor() {

	}

	async list() {
		const data = await UbicacionComercioModel.findAll();
		const result = data.map((row) => new UbicacionComercio(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await UbicacionComercioModel.findOne({ where: { id: id } });
		const result = (data) ? new UbicacionComercio(...data.getDataValues()) : null;

		return result;
	}

	async add(row:UbicacionComercio) {
		const data = await UbicacionComercioModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			coeficiente: row.coeficiente
		});
		const result = new UbicacionComercio(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:UbicacionComercio) {
		const affectedCount = await UbicacionComercioModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			coeficiente: row.coeficiente
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await UbicacionComercioModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new UbicacionComercio(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await UbicacionComercioModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
