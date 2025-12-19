import ICodigoBarrasClienteRepository from '../../../domain/repositories/codigo-barras-cliente-repository';
import CodigoBarrasClienteModel from './models/codigo-barras-cliente-model';
import CodigoBarrasCliente from '../../../domain/entities/codigo-barras-cliente';

export default class CodigoBarrasClienteRepositorySequelize implements ICodigoBarrasClienteRepository {

	constructor() {

	}

	async list() {
		const data = await CodigoBarrasClienteModel.findAll();
		const result = data.map((row) => new CodigoBarrasCliente(...row.getDataValues()));

		return result;
	}

	async listByCodigoBarras(codigoBarras:string) {
		const data = await CodigoBarrasClienteModel.findAll({ where: { codigoBarras: codigoBarras } });
		const result = data.map((row) => new CodigoBarrasCliente(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CodigoBarrasClienteModel.findOne({ where: { id: id } });
		const result = (data) ? new CodigoBarrasCliente(...data.getDataValues()) : null;

		return result;
	}

	async findByCodigoBarrasCliente(codigoBarrasCliente:string) {
		const data = await CodigoBarrasClienteModel.findOne({ where: { codigoBarrasCliente: codigoBarrasCliente } });
		const result = (data) ? new CodigoBarrasCliente(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CodigoBarrasCliente) {
		const data = await CodigoBarrasClienteModel.create({
			idTipoCodigoBarras: row.idTipoCodigoBarras,
			codigoBarras: row.codigoBarras,
			codigoBarrasCliente: row.codigoBarrasCliente
		});
		const result = new CodigoBarrasCliente(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CodigoBarrasCliente) {
		const affectedCount = await CodigoBarrasClienteModel.update({
			idTipoCodigoBarras: row.idTipoCodigoBarras,
			codigoBarras: row.codigoBarras,
			codigoBarrasCliente: row.codigoBarrasCliente
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CodigoBarrasClienteModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CodigoBarrasCliente(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CodigoBarrasClienteModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
