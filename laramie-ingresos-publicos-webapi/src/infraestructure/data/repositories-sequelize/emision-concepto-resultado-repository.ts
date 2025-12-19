import IEmisionConceptoResultadoRepository from '../../../domain/repositories/emision-concepto-resultado-repository';
import EmisionConceptoResultadoModel from './models/emision-concepto-resultado-model';
import EmisionConceptoResultado from '../../../domain/entities/emision-concepto-resultado';

export default class EmisionConceptoResultadoRepositorySequelize implements IEmisionConceptoResultadoRepository {

	constructor() {

	}

	async list() {
		const data = await EmisionConceptoResultadoModel.findAll();
		const result = data.map((row) => new EmisionConceptoResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucion(idEmisionEjecucion:number) {
		const data = await EmisionConceptoResultadoModel.findAll({ where: { idEmisionEjecucion: idEmisionEjecucion }, order: [['idEmisionEjecucionCuenta', 'ASC'],['idEmisionCuota', 'ASC'],['idEmisionConcepto','ASC']] });
		const result = data.map((row) => new EmisionConceptoResultado(...row.getDataValues()));

		return result;
	}

	async listByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const data = await EmisionConceptoResultadoModel.findAll({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = data.map((row) => new EmisionConceptoResultado(...row.getDataValues()));

		return result;
	}

	async findById(id:number) {
		const data = await EmisionConceptoResultadoModel.findOne({ where: { id: id } });
		const result = (data) ? new EmisionConceptoResultado(...data.getDataValues()) : null;

		return result;
	}

	async add(row:EmisionConceptoResultado) {
		const data = await EmisionConceptoResultadoModel.create({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionConcepto: row.idEmisionConcepto,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionConceptoResultado: row.idEstadoEmisionConceptoResultado,
			valorImporteTotal: row.valorImporteTotal,
			valorImporteNeto: row.valorImporteNeto,
			observacion: row.observacion
		});
		const result = new EmisionConceptoResultado(...data.getDataValues());

		return result;
	}

	async addBlock(rows:Array<EmisionConceptoResultado>) {
		const creates = rows.map(row => {
			return {
				idEmisionEjecucion: row.idEmisionEjecucion,
				idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
				idEmisionConcepto: row.idEmisionConcepto,
				idEmisionCuota: row.idEmisionCuota,
				idEstadoEmisionConceptoResultado: row.idEstadoEmisionConceptoResultado,
				valorImporteTotal: row.valorImporteTotal,
				valorImporteNeto: row.valorImporteNeto,
				observacion: row.observacion
			};
		});
        const affectedCount = await EmisionConceptoResultadoModel.bulkCreate(creates);

        const response = { id: 0 };
        const result = (affectedCount != null) ? response : null;
        return result;
	}

	async modify(id:number, row:EmisionConceptoResultado) {
		const affectedCount = await EmisionConceptoResultadoModel.update({
			idEmisionEjecucion: row.idEmisionEjecucion,
			idEmisionEjecucionCuenta: row.idEmisionEjecucionCuenta,
			idEmisionConcepto: row.idEmisionConcepto,
			idEmisionCuota: row.idEmisionCuota,
			idEstadoEmisionConceptoResultado: row.idEstadoEmisionConceptoResultado,
			valorImporteTotal: row.valorImporteTotal,
			valorImporteNeto: row.valorImporteNeto,
			observacion: row.observacion
		},
		{ where: { id: id } });

		const data = (affectedCount[0] > 0) ? await EmisionConceptoResultadoModel.findOne({ where: { id: id } }) : null;
		const result = (data) ? new EmisionConceptoResultado(...data.getDataValues()) : null;

		return result;
	}

	async remove(id:number) {
		const affectedCount = await EmisionConceptoResultadoModel.destroy({ where: { id: id } });
		const result = (affectedCount > 0) ? {id} : null;
		
		return result;
	}

	async removeByEmisionEjecucion(idEmisionEjecucion:number) {
		const affectedCount = await EmisionConceptoResultadoModel.destroy({ where: { idEmisionEjecucion: idEmisionEjecucion }});
		const result = (affectedCount > 0) ? {idEmisionEjecucion} : null;
		
		return result;
	}

	async removeByEmisionEjecucionCuenta(idEmisionEjecucionCuenta:number) {
		const affectedCount = await EmisionConceptoResultadoModel.destroy({ where: { idEmisionEjecucionCuenta: idEmisionEjecucionCuenta } });
		const result = (affectedCount > 0) ? {idEmisionEjecucionCuenta} : null;
		
		return result;
	}

}
