import ICuentaCorrienteCondicionEspecialRepository from '../../../domain/repositories/cuenta-corriente-condicion-especial-repository';
import CuentaCorrienteCondicionEspecialModel from './models/cuenta-corriente-condicion-especial-model';
import CuentaCorrienteCondicionEspecial from '../../../domain/entities/cuenta-corriente-condicion-especial';

export default class CuentaCorrienteCondicionEspecialRepositorySequelize implements ICuentaCorrienteCondicionEspecialRepository {

	constructor() {

	}

	async list() {
		const data = await CuentaCorrienteCondicionEspecialModel.findAll();
		const result = data.map((row) => new CuentaCorrienteCondicionEspecial(...row.getDataValues()));

		return result;
	}

	async listByCuenta(idCuenta: number) {
		const data = await CuentaCorrienteCondicionEspecialModel.findAll({ where: { idCuenta: idCuenta } });
		const result = data.map((row) => new CuentaCorrienteCondicionEspecial(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await CuentaCorrienteCondicionEspecialModel.findOne({ where: { id: id } });
		const result = (data) ? new CuentaCorrienteCondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async add(row:CuentaCorrienteCondicionEspecial) {
		const data = await CuentaCorrienteCondicionEspecialModel.create({
			numero: row.numero,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			idCuenta: row.idCuenta,
			codigoDelegacion: row.codigoDelegacion,
			numeroMovimiento: row.numeroMovimiento,
			numeroPartida: row.numeroPartida,
			numeroComprobante: row.numeroComprobante,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		});
		const result = new CuentaCorrienteCondicionEspecial(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:CuentaCorrienteCondicionEspecial) {
		const affectedCount = await CuentaCorrienteCondicionEspecialModel.update({
			numero: row.numero,
			idTipoCondicionEspecial: row.idTipoCondicionEspecial,
			numeroComprobante: row.numeroComprobante,
			fechaDesde: row.fechaDesde,
			fechaHasta: row.fechaHasta
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await CuentaCorrienteCondicionEspecialModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new CuentaCorrienteCondicionEspecial(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await CuentaCorrienteCondicionEspecialModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

}
