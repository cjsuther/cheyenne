import IPagoContadoDefinicionTipoVinculoCuentaRepository from '../../../domain/repositories/pago-contado-definicion-tipo-vinculo-cuenta-repository';
import PagoContadoDefinicionTipoVinculoCuentaModel from './models/pago-contado-definicion-tipo-vinculo-cuenta-model';
import PagoContadoDefinicionTipoVinculoCuenta from '../../../domain/entities/pago-contado-definicion-tipo-vinculo-cuenta';
import PagoContadoDefinicionTipoVinculoCuentaState from '../../../domain/dto/pago-contado-definicion-tipo-vinculo-cuenta-state';

export default class PagoContadoDefinicionTipoVinculoCuentaRepositorySequelize implements IPagoContadoDefinicionTipoVinculoCuentaRepository {

	constructor() {

	}

	async list() {
		const data = await PagoContadoDefinicionTipoVinculoCuentaModel.findAll();
		const result = data.map((row) => new PagoContadoDefinicionTipoVinculoCuenta(...row.getDataValues()));

		return result;
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const data = await PagoContadoDefinicionTipoVinculoCuentaModel.findAll({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = data.map((row) => new PagoContadoDefinicionTipoVinculoCuentaState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await PagoContadoDefinicionTipoVinculoCuentaModel.findOne({ where: { id: id } });
		const result = (data) ? new PagoContadoDefinicionTipoVinculoCuenta(...data.getDataValues()) : null;

		return result;
	}

	async add(row:PagoContadoDefinicionTipoVinculoCuenta) {
		const data = await PagoContadoDefinicionTipoVinculoCuentaModel.create({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta
		});
		const result = new PagoContadoDefinicionTipoVinculoCuenta(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:PagoContadoDefinicionTipoVinculoCuenta) {
		const affectedCount = await PagoContadoDefinicionTipoVinculoCuentaModel.update({
			idPagoContadoDefinicion: row.idPagoContadoDefinicion,
			idTipoVinculoCuenta: row.idTipoVinculoCuenta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await PagoContadoDefinicionTipoVinculoCuentaModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new PagoContadoDefinicionTipoVinculoCuenta(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await PagoContadoDefinicionTipoVinculoCuentaModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion:number) {
		const affectedCount = await PagoContadoDefinicionTipoVinculoCuentaModel.destroy({ where: { idPagoContadoDefinicion: idPagoContadoDefinicion } });
		const result = (affectedCount > 0) ? {idPagoContadoDefinicion} : null;
		
		return result;
	}

}
