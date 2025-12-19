import IRecaudadoraRepository from '../../../domain/repositories/recaudadora-repository';
import RecaudadoraModel from './models/recaudadora-model';
import Recaudadora from '../../../domain/entities/recaudadora';

export default class RecaudadoraRepositorySequelize implements IRecaudadoraRepository {

	constructor() {

	}

	async list() {
		const data = await RecaudadoraModel.findAll();
		const result = data.map((row) => new Recaudadora(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await RecaudadoraModel.findOne({ where: { id: id } });
		const result = (data) ? new Recaudadora(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigo(codigo:string) {
		const data = await RecaudadoraModel.findOne({ where: { codigo: codigo } });
		const result = (data) ? new Recaudadora(...data.getDataValues()) : null;

		return result;
	}

	async add(row:Recaudadora) {
		const data = await RecaudadoraModel.create({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			codigoCliente: row.codigoCliente,
			idLugarPago: row.idLugarPago,
			idMetodoImportacion: row.idMetodoImportacion
		});
		const result = new Recaudadora(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:Recaudadora) {
		const affectedCount = await RecaudadoraModel.update({
			codigo: row.codigo,
			nombre: row.nombre,
			orden: row.orden,
			codigoCliente: row.codigoCliente,
			idLugarPago: row.idLugarPago,
			idMetodoImportacion: row.idMetodoImportacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await RecaudadoraModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new Recaudadora(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await RecaudadoraModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
