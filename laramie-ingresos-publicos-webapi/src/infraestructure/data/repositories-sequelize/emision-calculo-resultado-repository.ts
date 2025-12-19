import IEmisionCalculoResultadoRepository from '../../../domain/repositories/emision-calculo-resultado-repository';
import EmisionCalculoResultadoModel from './models/emision-calculo-resultado-model';
import EmisionCalculoResultado from '../../../domain/entities/emision-calculo-resultado';

export default class EmisionCalculoResultadoRepositorySequelize implements IEmisionCalculoResultadoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionCalculoResultadoModel.findAll();
		const result = data.map((row) => new EmisionCalculoResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionCalculoResultadoModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion }, order: [['idEmisionEjecucionCuenta', 'ASC'],['idEmisionCuota', 'ASC'],['idEmisionCalculo','ASC']] });
		const result = data.map((row) => new EmisionCalculoResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const data = await EmisionCalculoResultadoModel.findAll({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = data.map((row) => new EmisionCalculoResultado(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionCalculoResultadoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionCalculoResultado(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionCalculoResultado) {
		const data = await EmisionCalculoResultadoModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCalculo: row.idEmisionCalculo,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionCalculoResultado: row.idEstadoEmisionCalculoResultado,
			valor: row.valor,
			observacion: row.observacion
		});
		const result = new EmisionCalculoResultado(...data.getDataValues());

		return result;
	}

	async addBlock(rows:Array<EmisionCalculoResultado>) {
		const creates = rows.map(row => {
			return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
				idEmisionCalculo: row.idEmisionCalculo,
				idEmisionCuota: row.idEmisionCuota,
				idEstadoEmisionCalculoResultado: row.idEstadoEmisionCalculoResultado,
				valor: row.valor,
				observacion: row.observacion
			};
		});
        const affectedCount = await EmisionCalculoResultadoModel.bulkCreate(creates);

        const response = { id: 0 };
        const result = (affectedCount != null) ? response : null;
        return result;
	}

	async modify(id:number, row:EmisionCalculoResultado) {
		const affectedCount = await EmisionCalculoResultadoModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionCalculo: row.idEmisionCalculo,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionCalculoResultado: row.idEstadoEmisionCalculoResultado,
			valor: row.valor,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionCalculoResultadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionCalculoResultado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionCalculoResultadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionCalculoResultadoModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const affectedCount = await EmisionCalculoResultadoModel.destroy({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = (affectedCount > 0) ? {idEmisionEjecucionCuenta} : null;
		
		return result;
	}

}
