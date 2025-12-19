import IEmisionCuentaCorrienteResultadoRepository from '../../../domain/repositories/emision-cuenta-corriente-resultado-repository';
import EmisionCuentaCorrienteResultadoModel from './models/emision-cuenta-corriente-resultado-model';
import EmisionCuentaCorrienteResultado from '../../../domain/entities/emision-cuenta-corriente-resultado';

export default class EmisionCuentaCorrienteResultadoRepositorySequelize implements IEmisionCuentaCorrienteResultadoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionCuentaCorrienteResultadoModel.findAll();
		const result = data.map((row) => new EmisionCuentaCorrienteResultado(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionCuentaCorrienteResultadoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionCuentaCorrienteResultado(...data.getDataValues()) : null;

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionCuentaCorrienteResultadoModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion }, order: [['idEmisionEjecucionCuenta', 'ASC'],['idEmisionCuota', 'ASC'],['idEmisionCuentaCorriente','ASC']] });
		const result = data.map((row) => new EmisionCuentaCorrienteResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const data = await EmisionCuentaCorrienteResultadoModel.findAll({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = data.map((row) => new EmisionCuentaCorrienteResultado(...row.getDataValues()));

		return result;
	}

	async add(row:EmisionCuentaCorrienteResultado) {
		const data = await EmisionCuentaCorrienteResultadoModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCuentaCorriente: row.idEmisionCuentaCorriente,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionCuentaCorrienteResultado: row.idEstadoEmisionCuentaCorrienteResultado,
			valorDebe: row.valorDebe,
			valorHaber: row.valorHaber,
			observacion: row.observacion
		});
		const result = new EmisionCuentaCorrienteResultado(...data.getDataValues());

		return result;
	}

	async addBlock(rows:Array<EmisionCuentaCorrienteResultado>) {
		const creates = rows.map(row => {
			return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
				idEmisionCuentaCorriente: row.idEmisionCuentaCorriente,
				idEmisionCuota: row.idEmisionCuota,
				idEstadoEmisionCuentaCorrienteResultado: row.idEstadoEmisionCuentaCorrienteResultado,
				valorDebe: row.valorDebe,
				valorHaber: row.valorHaber,
				observacion: row.observacion
			};
		});
        const affectedCount = await EmisionCuentaCorrienteResultadoModel.bulkCreate(creates);

        const response = { id: 0 };
        const result = (affectedCount != null) ? response : null;
        return result;
	}

	async modify(id:number, row:EmisionCuentaCorrienteResultado) {
		const affectedCount = await EmisionCuentaCorrienteResultadoModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCuentaCorriente: row.idEmisionCuentaCorriente,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionCuentaCorrienteResultado: row.idEstadoEmisionCuentaCorrienteResultado,
			valorDebe: row.valorDebe,
			valorHaber: row.valorHaber,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionCuentaCorrienteResultadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionCuentaCorrienteResultado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionCuentaCorrienteResultadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionCuentaCorrienteResultadoModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const affectedCount = await EmisionCuentaCorrienteResultadoModel.destroy({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = (affectedCount > 0) ? {idEmisionEjecucionCuenta} : null;
		
		return result;
	}

}
