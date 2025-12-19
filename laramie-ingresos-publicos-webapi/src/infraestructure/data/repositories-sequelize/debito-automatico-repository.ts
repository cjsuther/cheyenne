import IDebitoAutomaticoRepository from '../../../domain/repositories/debito-automatico-repository';
import DebitoAutomaticoModel from './models/debito-automatico-model';
import DebitoAutomatico from '../../../domain/entities/debito-automatico';
import DebitoAutomaticoState from '../../../domain/dto/debito-automatico-state';

export default class DebitoAutomaticoRepositorySequelize implements IDebitoAutomaticoRepository {

	constructor() {

	}

	async listByCuenta(idCuenta: number) {
		const data = await DebitoAutomaticoModel.findAll({where: { idCuenta: idCuenta }});
		const result = data.map((row) => new DebitoAutomaticoState(...row.getDataValues()));

		return result;
	}

	async listBySubTasa(idSubTasa: number) {
		const data = await DebitoAutomaticoModel.findAll({where: { idSubTasa: idSubTasa }});
		const result = data.map((row) => new DebitoAutomaticoState(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await DebitoAutomaticoModel.findOne({ where: { id: id } });
		const result = (data) ? new DebitoAutomatico(...data.getDataValues()) : null;

		return result;
	}

	async add(row:DebitoAutomatico) {
		const data = await DebitoAutomaticoModel.create({
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idRubro: row.idRubro,
			idTipoSolicitudDebitoAutomatico: row.idTipoSolicitudDebitoAutomatico,
			numeroSolicitudDebitoAutomatico: row.numeroSolicitudDebitoAutomatico,
			idMedioPago: row.idMedioPago,
			detalleMedioPago: row.detalleMedioPago,
			fechaDesde: row.fechaDesde,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		});
		const result = new DebitoAutomatico(...data.getDataValues());

		return result;
	}

	async modify(id:number, row:DebitoAutomatico) {
		const affectedCount = await DebitoAutomaticoModel.update({
			idCuenta: row.idCuenta,
			idTasa: row.idTasa,
			idSubTasa: row.idSubTasa,
			idRubro: row.idRubro,
			idTipoSolicitudDebitoAutomatico: row.idTipoSolicitudDebitoAutomatico,
			numeroSolicitudDebitoAutomatico: row.numeroSolicitudDebitoAutomatico,
			idMedioPago: row.idMedioPago,
			detalleMedioPago: row.detalleMedioPago,
			fechaDesde: row.fechaDesde,
			fechaAlta: row.fechaAlta,
			fechaBaja: row.fechaBaja
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await DebitoAutomaticoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new DebitoAutomatico(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await DebitoAutomaticoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByCuenta(idCuenta: number) {
		const affectedCount = await DebitoAutomaticoModel.destroy({ where: { idCuenta: idCuenta } });
		const result = (affectedCount > 0) ? {idCuenta} : null;
		
		return result;
	}

}
