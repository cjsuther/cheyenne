import IEmisionImputacionContableResultadoRepository from '../../../domain/repositories/emision-imputacion-contable-resultado-repository';
import EmisionImputacionContableResultadoModel from './models/emision-imputacion-contable-resultado-model';
import EmisionImputacionContableResultado from '../../../domain/entities/emision-imputacion-contable-resultado';

export default class EmisionImputacionContableResultadoRepositorySequelize implements IEmisionImputacionContableResultadoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionImputacionContableResultadoModel.findAll();
		const result = data.map((row) => new EmisionImputacionContableResultado(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionImputacionContableResultadoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionImputacionContableResultado(...data.getDataValues()) : null;

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionImputacionContableResultadoModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion }, order: [['idEmisionEjecucionCuenta', 'ASC'],['idEmisionCuota', 'ASC'],['idEmisionImputacionContable','ASC']] });
		const result = data.map((row) => new EmisionImputacionContableResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const data = await EmisionImputacionContableResultadoModel.findAll({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = data.map((row) => new EmisionImputacionContableResultado(...row.getDataValues()));

		return result;
	}

	async add(row:EmisionImputacionContableResultado) {
		const data = await EmisionImputacionContableResultadoModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionImputacionContable: row.idEmisionImputacionContable,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionImputacionContableResultado: row.idEstadoEmisionImputacionContableResultado,
			valorPorcentaje: row.valorPorcentaje,
			observacion: row.observacion
		});
		const result = new EmisionImputacionContableResultado(...data.getDataValues());

		return result;
	}

	async addBlock(rows:Array<EmisionImputacionContableResultado>) {
		const creates = rows.map(row => {
			return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
				idEmisionImputacionContable: row.idEmisionImputacionContable,
				idEmisionCuota: row.idEmisionCuota,
				idEstadoEmisionImputacionContableResultado: row.idEstadoEmisionImputacionContableResultado,
				valorPorcentaje: row.valorPorcentaje,
				observacion: row.observacion
			};
		});
        const affectedCount = await EmisionImputacionContableResultadoModel.bulkCreate(creates);

        const response = { id: 0 };
        const result = (affectedCount != null) ? response : null;
        return result;
	}

	async modify(id:number, row:EmisionImputacionContableResultado) {
		const affectedCount = await EmisionImputacionContableResultadoModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionImputacionContable: row.idEmisionImputacionContable,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionImputacionContableResultado: row.idEstadoEmisionImputacionContableResultado,
			valorPorcentaje: row.valorPorcentaje,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionImputacionContableResultadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionImputacionContableResultado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionImputacionContableResultadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionImputacionContableResultadoModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const affectedCount = await EmisionImputacionContableResultadoModel.destroy({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = (affectedCount > 0) ? {idEmisionEjecucionCuenta} : null;
		
		return result;
	}

}
