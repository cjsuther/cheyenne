import IElementoRepository from '../../../domain/repositories/elemento-repository';
import ElementoModel from './models/elemento-model';
import Elemento from '../../../domain/entities/elemento';

export default class ElementoRepositorySequelize implements IElementoRepository {

	constructor() {

	}

	async list() {
		const data = await ElementoModel.findAll();
		const result = data.map((row) => new Elemento(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await ElementoModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new Elemento(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await ElementoModel.findOne({ where: { id: id } });
		const result = (data) ? new Elemento(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Elemento) {
		const data = await ElementoModel.create({
			idClaseElemento: row.idClaseElemento,
			idTipoElemento: row.idTipoElemento,
			idCuenta: row.idCuenta,
			cantidad: row.cantidad,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		});
		const result = new Elemento(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Elemento) {
		const affectedCount = await ElementoModel.update({
			idClaseElemento: row.idClaseElemento,
			idTipoElemento: row.idTipoElemento,
			idCuenta: row.idCuenta,
			cantidad: row.cantidad,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await ElementoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Elemento(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await ElementoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
